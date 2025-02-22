import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [search, setSearch] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [savedCandidates, setSavedCandidtates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchNextCandidate();
  }, []);

  const fetchNextCandidate = async () => {
    if (candidates.length === 0) {
      const response: Candidate[] = await searchGithubUser('someUsername');
      setCandidates(response);
  }

  if (candidates.length > 0) {
    setCandidate(candidates.shift() || null);
  }
};

const handleAcceptCandidate = () => {
  if (candidate) {
    const updatedSaved = [...savedCandidates, candidate];
    setSavedCandidtates(updatedSaved);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedSaved));
  }
  fetchNextCandidate();
};

const handleRejectCandidate = () => {
  fetchNextCandidate();
};

return (
  <div>
    <h1>Candidate Search</h1>;
    {candidate ? (
      <div>
        <img src={candidate.avatar_url} alt={candidate.name} width="100" />
          <h2>{candidate.name}</h2>
          <p>Username: {candidate.login}</p>
          <p>Location: {candidate.location || 'Unknown'}</p>
          <p>Email: {candidate.email || 'Not available'}</p>
          <p>Company: {candidate.company || 'Not available'}</p>
          <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
            GitHub Profile
          </a>
          <br />
          <button onClick={handleAcceptCandidate}>+</button>
          <button onClick={handleRejectCandidate}>-</button>
        </div>
      ) : (
        <p>No more candidates available.</p>
      )}
    </div>
  );
};


export default CandidateSearch;
const [candidate, setCandidate] = useState<Candidate | null>(null);

