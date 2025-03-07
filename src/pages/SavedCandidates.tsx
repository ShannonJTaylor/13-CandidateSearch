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

  const handleRejectCandidate = (id: number) => {
    const updatedCandidates = SavedCandidates.filter(
      (candidate) => candidate.id !== id
    );
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };
  return (
    <div>
      <h1>Potential Candidates</h1>
      {SavedCandidates.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>              
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>GitHub Profile</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>        
          {SavedCandidates.map((candidate) => (
            <tr key={`{candidate.id}-${candidate.login}`}>
            <td>
              <img src={candidate.avatar_url} alt={candidate.name} width="50" />
            </td>
            <td>Name:{candidate.name || candidate.login}</td> {/* Fallback to login if name is missing */}                    
            <td>Location: {candidate.location || 'Unknown'}</td>
            <td>Email: {candidate.email || 'Not available'}</td>
            <td>Company: {candidate.company || 'Not available'}</td>
            <td>Bio: {candidate.bio || 'Not available'}</td>
            <td>
              <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                GitHub Profile
              </a>
            </td>
            <td>
              <button className="reject-button" onClick={() => handleRejectCandidate(candidate.id)}>-</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>         
    ) : (
      <p>No candidates have been accepted.</p>
    )}
    </div>
  );
};

export default SavedCandidates;
