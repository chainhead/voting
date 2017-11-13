pragma solidity ^0.4.18;
// @title - Decentralized rating system.
//
// Begin contract definition
contract Rating {
    // Voters for a given rating round.
    struct RatingVoter {
        // Identifier is set outside of the blockchain
        bytes32 voterId;
        // Flag denoting the status of voting
        bool voted;
    }
    // Contestants of a given rating round
    struct RatingContestant {
        // Identifier is set outside of the blockchain
        bytes32 contestantId;
        // Number of votes received by a contestant
        uint256 votesReceived;
    }
    // Rating round
    struct RatingRound {
        // Identifier is set outside of the blockchain
        bytes32 ratingId;
        // Flag denoting the expiration of rating round
        bool ratingActive;
        // cotestantId of the winner of the rating round
        uint256 winningVotes;
        // A list of cotestants for this rating round
        bytes32[] contestantsId;
        // The winning contestantId for this rating round
        bytes32 winningContestantId;
        // Voters of this rating round
        mapping (bytes32 => RatingVoter) ratingVoters;
        // Contestants of this rating round
        mapping (bytes32 => RatingContestant) ratingContestants;
    }
    // Rating rounds created so far
    mapping (bytes32 => RatingRound) ratingRounds;
    RatingRound public rr;
    /*
    Rating Round constructor using a ratingId as a constructing argument.
    */
    function Rating(bytes32 _ratingId) public {
        rr.ratingId = _ratingId;
        rr.ratingActive = true;
        rr.winningVotes = 0;
        rr.winningContestantId = 0x00;
        ratingRounds[_ratingId] = rr;
    }
    /*
    Add a contestant to existing, non-expired rating round.
    */
    function addContestant(bytes32 _ratingId, bytes32 _contestantId) public {
        // Rating Round indicated by ratingId exists
        bool ratingIdExists = (ratingRounds[_ratingId].ratingId == _ratingId);
        // Rating Round is active 
        bool ratingIdActive = (ratingRounds[_ratingId].ratingActive == true);
        // Contestant Id is not yet added to the ratingId Rating Round
        bool contestantIdNew = (ratingRounds[_ratingId].ratingContestants[_contestantId].contestantId == _contestantId);
        // Check for existing, non-expiring rating round
        require(ratingIdExists && ratingIdActive && !contestantIdNew);
        // Add a contestant as conditions have been met.
        rr.contestantsId.push(_contestantId);
        ratingRounds[_ratingId].ratingContestants[_contestantId].contestantId = _contestantId;
        ratingRounds[_ratingId].ratingContestants[_contestantId].votesReceived = 0;
    }
    /*
    Add a voter to existing, non-expiring rating round.
    */
    function addVoter(bytes32 _ratingId, bytes32 _voterId) public {
        // Rating Round indicated by ratingId exists
        bool ratingIdExists = (ratingRounds[_ratingId].ratingId == _ratingId);
        // Rating Round is active 
        bool ratingIdActive = (ratingRounds[_ratingId].ratingActive == true);
        // Voter exists for this round
        bool voterIdExists = (ratingRounds[_ratingId].ratingVoters[_voterId].voterId == _voterId);
        // Voter is not contestant
        bool voterContestant = (ratingRounds[_ratingId].ratingContestants[_voterId].contestantId == _voterId);
        // Check for existing, non-expiring round and valid voter
        require(ratingIdExists && ratingIdActive && !voterIdExists && !voterContestant);
        // Add voter as conditions have been met
        ratingRounds[_ratingId].ratingVoters[_voterId].voterId = _voterId;
        ratingRounds[_ratingId].ratingVoters[_voterId].voted = false;
    }
    /*
    Add vote for a contestant of existing, non-expiring rating round.
    */
    function addVote(bytes32 _ratingId, bytes32 _contestantId, bytes32 _voterId) public {
        // Rating Round indicated by ratingId exists
        bool ratingIdExists = (ratingRounds[_ratingId].ratingId == _ratingId);
        // Rating Round is active 
        bool ratingIdActive = (ratingRounds[_ratingId].ratingActive == true); 
        // Voter exists for this round
        bool voterIdExists = (ratingRounds[_ratingId].ratingVoters[_voterId].voterId == _voterId);
        // Voter is not contestant
        bool voterContestant = (ratingRounds[_ratingId].ratingContestants[_voterId].contestantId == _voterId);
        // Voter has voted already
        bool voterIdVoted = (ratingRounds[_ratingId].ratingVoters[_voterId].voted == false);
        // Check for existing, non-expiring round and valid voter
        require(ratingIdExists && ratingIdActive && voterIdExists && !voterContestant && voterIdVoted);
        // Add vote as all conditions have been met
        ratingRounds[_ratingId].ratingContestants[_contestantId].votesReceived += 1;
        ratingRounds[_ratingId].ratingVoters[_voterId].voted = true;
    }
    /*
    Find the winner of this rating round
    */
    function ratingResult(bytes32 _ratingId) public {
        bytes32 winningContestant = 0x00;
        bytes32 contestantId = 0x00;
        uint256 maxVotes = 0;
        uint256 contestantVotes = 0;
        // Rating Round indicated by ratingId exists
        bool ratingIdExists = (ratingRounds[_ratingId].ratingId == _ratingId);
        // Rating Round is active 
        bool ratingIdActive = (ratingRounds[_ratingId].ratingActive == true); 
        // Check for existing and non-expiring round
        require(ratingIdExists && ratingIdActive);
        // Find winner as valid ratingId has been identified
        for (uint i = 0; i < rr.contestantsId.length; i++) {
            contestantId = rr.contestantsId[i];
            contestantVotes = ratingRounds[_ratingId].ratingContestants[contestantId].votesReceived;
            if (contestantVotes > maxVotes) {
                winningContestant = contestantId;
                maxVotes = contestantVotes;
            }
        }
        // Assign contestantId and votes
        rr.winningContestantId = winningContestant;
        rr.winningVotes = maxVotes;
        // Only the assignment to the mapping variable should do
        ratingRounds[_ratingId].winningContestantId = winningContestant;
    }
    /*
    Get rating result
    */
    //function getRatingResult(bytes32 _ratingId) public constant returns (bytes32) {
    function getRatingResult() public constant returns (bytes32) {
        return rr.winningContestantId;
    }
    /*
    Close the rating round
    */
    function closeRatingRound(bytes32 _ratingId) public {
        // Rating Round indicated by ratingId exists
        bool ratingIdExists = (ratingRounds[_ratingId].ratingId == _ratingId);
        // Rating Round is active 
        bool ratingIdActive = (ratingRounds[_ratingId].ratingActive == true); 
        require(ratingIdExists && ratingIdActive);
        // Close round
        ratingRounds[_ratingId].ratingActive = false;
    }
}