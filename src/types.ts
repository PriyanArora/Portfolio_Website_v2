export interface Profile {    
    name: string;     
    elevatorPitch: string[];
    location: string;   
    certifications: { name: string; url: string }[];
    socials: {
        github: string;
        linkedin: string;
        email: string;
    };  
    skills: { category: string; items: string[] }[];
    status: Record<string, string>;
}    
