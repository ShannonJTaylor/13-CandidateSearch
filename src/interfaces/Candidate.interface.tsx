// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
  id: number;
  name: string;
  email?: string;
  phone: string;
  skills: string[];
  experience: number;
  education: string;
  avatar_url: string;
  location?: string;
}
