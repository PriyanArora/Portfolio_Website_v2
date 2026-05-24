export interface Profile {    
    name: string;     
    elevatorPitch: string[];
    location: string;   
    education: {
        school: string;   
        degree: string;
        period: string;  
    };
    awards: string[];
    grades: string[];
    certifications: { name: string; url: string }[];
    socials: {
        github: string;
        linkedin: string;
        email: string;
    };  
    skills: { category: string; items: string[] }[];
    status: Record<string, string>;
}    
  
export interface ResumeEntry {    
    role: string; 
    company: string;
    period: string;
    bullets: string[];
}

export interface EducationEntry {  
    degree: string;
    school: string;   
    period: string;
    details: string;
}

export interface Resume {
    experience: ResumeEntry[];
    education: EducationEntry[];
    certifications: string[];
}    
