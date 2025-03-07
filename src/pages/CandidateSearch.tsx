import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);  
  const [savedCandidates, setSavedCandidtates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchNextCandidate();
  }, []);

  const fetchNextCandidate = async () => {
    if (candidates.length === 0) {
      const response: Candidate[] = await searchGithub();
      console.log("Fetched Candidates:", response); // ✅ Debugging
      
      setCandidates(response);
      fetchDetailedCandidate(response[0]);  //Fetch detailed data    
  } else {
    const [next, ...remaining] = candidates; // ✅ Extract first candidate
    setCandidates(remaining);
    fetchDetailedCandidate(next); //Fetch detailed data 
  }
};

const fetchDetailedCandidate = async (candidate: Candidate | null) => {
  if  (!candidate) {
    setCandidate(null);
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${candidate.login}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });

    const data = await response.json();
    console.log("Detailed Candidate Data:", data); // ✅ Debugging

    setCandidate({
      ...candidate,
      location: data.location || "Unknown",
      email: data.email || "Not available",
      company: data.company || "Not available",
      bio: data.bio || "Not available",
    });
  } catch (err) {
    console.error("Error fetching candidate details:", err);
    setCandidate(candidate); // Fallback to original data
  }
};
const handleAcceptCandidate = () => {
  if (candidate) {
    setSavedCandidtates((prevSavedCandidates) => {
      if (!prevSavedCandidates.some((saved) => saved.id === candidate.id)) {
        const updatedSaved = [...prevSavedCandidates, candidate];
        localStorage.setItem('savedCandidates', JSON.stringify(updatedSaved));
        return updatedSaved;        
      }
      return prevSavedCandidates;
    });
  
    fetchNextCandidate();
  }
};

const handleRejectCandidate = () => {
  fetchNextCandidate();
};

return (
  <div>
    <h1>Candidate Search</h1>
    {candidate ? (
      <div>
        <img src={candidate.avatar_url} alt={candidate.name} width="100" />
          <h2>{candidate.name || candidate.login}</h2>
          <p>Username: {candidate.login}</p>
          <p>Location: {candidate.location || 'Unknown'}</p>
          <p>Email: {candidate.email || 'Not available'}</p>
          <p>Company: {candidate.company || 'Not available'}</p>
          <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
            GitHub Profile
          </a>
          <br />
          <button onClick={handleAcceptCandidate} className="accept-button">+</button>
          <button onClick={handleRejectCandidate} className="reject-button">-</button>
        </div>
      ) : (
        <p>No more candidates available.</p>
      )}
    </div>
  );
};


export default CandidateSearch;
