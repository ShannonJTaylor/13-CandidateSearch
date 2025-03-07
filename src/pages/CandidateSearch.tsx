import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);   
  
  useEffect(() => {
    fetchNextCandidate();
  }, []);
  

  const fetchNextCandidate = async () => {
    if (candidates.length === 0) {
      const response: Candidate[] = await searchGithub();
      console.log("Fetched Candidates:", response); // Debugging
      
      setCandidates(response);
      fetchDetailedCandidate(response[0]);  //Fetch detailed data    
  } else {
    const [next, ...remaining] = candidates; // Extract first candidate
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
    console.log("Detailed Candidate Data:", data); // Debugging

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
    const savedCandidatesFromStorage = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    if (!savedCandidatesFromStorage.some((saved: Candidate) => saved.id === candidate.id)) {
        const updatedSaved = [...savedCandidatesFromStorage, candidate];
        localStorage.setItem('savedCandidates', JSON.stringify(updatedSaved));                 
      }     
  
    fetchNextCandidate();
  }
};

const handleRejectCandidate = () => {
  fetchNextCandidate();
};

return (
  <>
    <h1>Candidate Search</h1>
    {candidate ? (
      <div className="candidate-card">
        <div className="candidate-avatar">
        <img src={candidate.avatar_url} alt={candidate.name} width="100" />
      </div>

      <div className="candidate-info">
        <h2>{candidate.name? candidate.name : candidate.login}</h2>
        <p>Username: {candidate.login}</p>
        <p>Location: {candidate.location || 'Unknown'}</p>
        <p>Email: {candidate.email || 'Not available'}</p>
        <p>Company: {candidate.company || 'Not available'}</p>
        <p>Bio: {candidate.bio || 'Not available'}</p>
        <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
          GitHub Profile
          </a>
        </div>                  
      
        <div className="button-group">   
          <button className="accept-button" onClick={handleAcceptCandidate}>+</button>
          <button className="reject-button" onClick={handleRejectCandidate}>-</button>
        </div>
      </div>        
      ) : (
        <p>No more candidates available.</p>
      )}
    </>
  );
};
  



export default CandidateSearch;
