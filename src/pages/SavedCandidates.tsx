import { useState, useEffect } from "react";
import { Candidate } from "../interfaces/Candidate.interface";


const SavedCandidates = () => {
  const [SavedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  
  useEffect(() => {
    const storedCandidtes = localStorage.getItem("savedCandidates");
    if (storedCandidtes) {
      setSavedCandidates(JSON.parse(storedCandidtes));
    }
  }, []);

  return (
    <div>
      <h1>Potential Candidates</h1>
      {SavedCandidates.length > 0 ? (
        <ul>
          {SavedCandidates.map((candidate) => (
            <li key={`{candidate.id}-${candidate.login}`} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            <img src={candidate.avatar_url} alt={candidate.name} width="50" />
            <h2>{candidate.name}</h2>
            <p>Username: {candidate.login}</p>
            <p>Location: {candidate.location || 'Unknown'}</p>
            <p>Email: {candidate.email || 'Not available'}</p>
            <p>Company: {candidate.company || 'Not available'}</p>
            <p>Bio: {candidate.bio || 'Not available'}</p>
            <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </li>
        ))}
      </ul>
    ) : (
      <p>No candidates have been accepted.</p>
    )}
    </div>
  );
};

export default SavedCandidates;
