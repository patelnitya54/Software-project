/* ---------- Data ---------- */
        const sections = [
            {
                type: 'intro',
                lead: "Welcome to Workin! I'm honored to help you discover what's next.",
                helper: "Finding work you love takes time & intention, but you're in the right place my friend.",
                sub: "Let's start with your background.",
                files: ['Upload Resume', 'Connect LinkedIn'],
                ackFunc: (sel) => "Thanks for sharing, I have a much better understanding of your journey."
            },
            {
                type: 'job-function',
                lead: "Alright let's start narrowing things down, What roles are you looking for?",
                categories: [
                    {
                        name: "Software/Internet/AI",
                        subcategories: [
                            {
                                name: "Backend Engineering",
                                roles: ["Backend Engineer", "Full Stack Engineer", "Python Engineer", "Java Engineer", "C/C++ Engineer", ".Net Engineer", "Golang Engineer", "Salesforce Developer", "Blockchain Engineer"]
                            },
                            {
                                name: "Data & Analytics",
                                roles: ["Data Analyst", "Data Scientist", "Data Engineer", "Business/BI Analyst", "Power BI Developer", "ETL Developer", "Data Warehouse Engineer"]
                            },
                            {
                                name: "Machine Learning & AI",
                                roles: ["Machine Learning Engineer", "AI Engineer", "Machine Learning/AI Researcher", "Machine Learning, Deep Learning", "LLM Engineer", "Machine Learning, Model Training and Inference", "Machine Learning, Computer Vision", "Machine Learning, Operations (ML Ops)", "Machine Learning, Search System", "Machine Learning, Infrastructure", "Data Annotation/AI Tutor", "Machine Learning, Ads"]
                            },
                            {
                                name: "Frontend/Mobile/Game",
                                roles: ["Frontend Software Engineer", "React Developer", "UI/UX Developer", "Android Developer", "Game Developer", "iOS/Swift Developer", "Flutter Developer", "Unity Developer", "Unreal Engine Developer", "AR/VR Developer"]
                            },
                            {
                                name: "System Reliability & Security",
                                roles: ["DevOps", "Cyber Security Analyst", "Cyber Security Engineer", "Cloud Security Engineer", "Systems Engineer", "Network Security Engineer", "Network Engineer", "Site Reliability Engineer (SRE)", "SoC Analyst"]
                            },
                            {
                                name: "Technical Support",
                                roles: ["IT Support Specialist", "Help Desk Technician/Desktop Support Technician", "Database Administrator", "System Administrator", "Network Support Specialist", "Salesforce Administrator"]
                            },
                            {
                                name: "Testing",
                                roles: ["Software Testing/Quality Assurance Engineer", "Automation Test Engineer", "QA Manager"]
                            },
                            {
                                name: "Project Management",
                                roles: ["Project/Program Manager", "Technical Project Manager", "Scrum Master"]
                            },
                            {
                                name: "Technical Leadership",
                                roles: ["Engineering Manager", "Software Architect", "Engineering Director/VP", "CTO"]
                            },
                            {
                                name: "Technical Sales",
                                roles: ["Solutions Architect/Forward Deployed Engineer", "Sales Engineer"]
                            },
                            {
                                name: "Technical Writing",
                                roles: ["Developer Relations", "Technical Account Manager"]
                            },
                        ]
                    },
                    {
                        name: "Consulting",
                        subcategories: [
                            {
                                name: "IT Consulting",
                                roles: ["Business Analyst", "Data Consultant", "IT Consultant", "Cyber Security Consultant"]
                            },
                            {
                                name: "Business Strategy & Management Consulting",
                                roles: ["Business Strategy Consultant", "Market Research Analyst", "Operations Consultant", "Change Management Consultant"]
                            },
                            {
                                name: "Financial Advisory",
                                roles: ["Financial Consultant", "Risk Management Consultant", "Mergers & Acquisitions (M&A) Consultant"]
                            },
                        ]
                    },
                    {
                        name: "Marketing",
                        subcategories: [
                            {
                                name: "SEO and Content Marketing",
                                roles: ["Content Marketing/Strategy", "Social Media Management", "SEO", "Copywriter"]
                            },
                            {
                                name: "Brand and Communications Marketing",
                                roles: ["Brand Manager", "Public Relations", "Event Marketing Specialist", "Community Manager"]
                            },
                            {
                                name: "Growth Marketing",
                                roles: ["Growth Marketing", "Performance Marketing", "Advertising Specialist"]
                            },
                            {
                                name: "Product Marketing",
                                roles: ["Product Marketing"]
                            },
                            {
                                name: "Lifecycle and Email Marketing",
                                roles: ["Email Marketing", "Lifecycle Marketing"]
                            },
                        ]
                    },
                    {
                        name: "Finance",
                        subcategories: [
                            {
                                name: "Investment/Financing",
                                roles: ["Financial Analyst", "Risk Analyst", "Quantitative Analyst/Researcher", "Equity Analyst", "Portfolio Manager", "Asset Manager", "Investment Manager", "Securities Trader"]
                            },
                            {
                                name: "Banking",
                                roles: ["Credit Analyst", "Investment Banker", "Commercial Banker", "Loan Officer"]
                            },
                            {
                                name: "VC/PE",
                                roles: ["Investment Analyst/Associate", "Portfolio Operations Manager", "Investor Relations Manager", "Investment Direct/VP", "Investment Partner", "Fundraising Manager"]
                            },
                            {
                                name: "Corporate Finance",
                                roles: ["Corporate Finance Analyst", "Treasury"]
                            },
                            {
                                name: "Insurance",
                                roles: ["Underwriter", "Actuary"]
                            },
                        ]
                    },
                    {
                        name: "Product",
                        subcategories: [
                            {
                                name: "Product Management",
                                roles: ["Product Manager", "Product Analyst", "Technical Product Manager", "AI Product Manager", "Product Manager, B2B/SaaS", "Product Manager, Consumer Software", "Product Manager, Hardware/Robotics/IoT", "Game Designer"]
                            },
                        ]
                    },
                    {
                        name: "Healthcare",
                        subcategories: [
                            {
                                name: "Healthcare IT",
                                roles: ["Healthcare Data Analyst", "Healthcare Data Scientist", "Healthcare IT Specialist", "EHR (Electronic Health Records) System Administrator"]
                            },
                            {
                                name: "Health Product & Operations Management",
                                roles: ["Health Product Manager", "Healthcare Quality Improvement Specialist", "Clinical Operations Manager", "Healthcare Compliance Manager"]
                            },
                            {
                                name: "Clinical & Regulatory",
                                roles: ["Clinical Research Associate", "Clinical Research Scientist", "Biostatistician", "Medical Writer", "Regulatory Affairs Specialist"]
                            },
                            {
                                name: "Drug Discovery & Development",
                                roles: ["Biologist", "Biochemist", "Chemist", "Pharmacologist", "Formulation Scientist", "Toxicologist", "DMPK Scientist"]
                            },
                            {
                                name: "Biomedical Engineering & Technology",
                                roles: ["Biomedical Engineer", "Clinical Engineer", "Biomedical Equipment Technician"]
                            },
                        ]
                    },
                    {
                        name: "Electrical Engineering",
                        subcategories: [
                            {
                                name: "Electronics & Hardware",
                                roles: ["Embedded Software Engineer", "Electronics Engineer", "Hardware Engineer", "Systems Integration Engineer", "FPGA Engineer", "PCB Engineer", "ASIC Engineer", "RF (Radio Frequency) Engineer"]
                            },
                            {
                                name: "Electrical & Automation",
                                roles: ["Electrical Engineer", "Robotics Engineer", "Automation Engineer", "Controls Engineer", "Electromechanical Engineer"]
                            },
                            {
                                name: "Telecommunications",
                                roles: ["Network Engineer", "Telecommunications Engineer", "Wireless/Antenna Engineer"]
                            },
                            {
                                name: "Semiconductors & Chips",
                                roles: ["IC Design Engineer", "Digital IC Verification Engineer", "Analog IC Design Engineer"]
                            },
                            {
                                name: "Testing",
                                roles: ["Hardware Test Engineer", "Electrical Test Engineer"]
                            },
                            {
                                name: "Technical Project Management",
                                roles: ["Project/Program Manager"]
                            },
                            {
                                name: "Sales & Technical Support",
                                roles: ["Solutions Architect", "Sales Engineer"]
                            },
                            {
                                name: "Electrical Vehicles",
                                roles: ["Battery Engineer", "Motor Engineer"]
                            },
                            {
                                name: "Aerospace Engineering",
                                roles: ["Aerospace Engineer"]
                            },
                        ]
                    },
                    {
                        name: "Human Resource/Administrative/Legal",
                        subcategories: [
                            {
                                name: "Executive and Administrative",
                                roles: ["Data Entry Clerk", "Administrative Assistant", "Executive Assistant", "Office Manager", "Receptionist", "Chief of Staff"]
                            },
                            {
                                name: "Human Resource",
                                roles: ["Human Resource Specialist", "Recruiter/Sourcer", "Recruiting Coordinator", "HR Business Partner", "Human Resource Manager/Director", "Payroll Specialist"]
                            },
                            {
                                name: "Legal",
                                roles: ["Paralegal", "Corporate Counsel"]
                            },
                        ]
                    },
                    {
                        name: "Sales",
                        subcategories: [
                            {
                                name: "Business Development",
                                roles: ["Business Development", "Partnership"]
                            },
                            {
                                name: "Inside Sales",
                                roles: ["Sales Development Representative", "Inside Sales Representative", "Account Executive, SMB"]
                            },
                            {
                                name: "Sales Management",
                                roles: ["Sales Manager", "Regional Sales Manager", "Sales Director/VP"]
                            },
                            {
                                name: "Sales Operations",
                                roles: ["Sales Operations Specialist", "Sales Support"]
                            },
                            {
                                name: "Outside Sales",
                                roles: ["Enterprise Sales", "Field Sales Representative"]
                            },
                            {
                                name: "Channel Sales",
                                roles: []
                            },
                            {
                                name: "Retail Sales",
                                roles: ["Retail Sales", "Store Manager"]
                            },
                            {
                                name: "Medical Sales",
                                roles: ["Medical Sales", "Medical Device Sales"]
                            },
                            {
                                name: "Financial Sales",
                                roles: ["Financial Advisor"]
                            },
                            {
                                name: "Insurance Sales",
                                roles: []
                            },
                            {
                                name: "Real Estate Sales/Leasing",
                                roles: ["Real Estate Sales", "Leasing Manager"]
                            },
                            {
                                name: "Automotive Sales",
                                roles: ["Automotive Sales"]
                            },
                        ]
                    },
                    {
                        name: "Production/Manufacturing",
                        subcategories: [
                            {
                                name: "Mechanical Design & Manufacturing",
                                roles: ["Mechanical Engineer", "Manufacturing Engineer", "Process Engineer", "Industrial Engineer", "Mechatronics Engineer"]
                            },
                            {
                                name: "Technical Project Management",
                                roles: ["Project/Program Manager"]
                            },
                            {
                                name: "Operations & Safety",
                                roles: ["Operations Manager/Director", "Safety Engineer"]
                            },
                            {
                                name: "Quality Management",
                                roles: ["Quality Assurance Specialist"]
                            },
                            {
                                name: "Automotive R&D & Manufacturing",
                                roles: ["Automotive Engineer", "Autonomous Driving System Engineer", "Powertrain Engineer"]
                            },
                            {
                                name: "Chemical Engineering",
                                roles: ["Chemical Engineer", "Laboratory Technician"]
                            },
                            {
                                name: "Environmental Protection",
                                roles: ["EHS (Environment, Health, Safety) Engineer"]
                            },
                        ]
                    },
                    {
                        name: "Customer Service",
                        subcategories: [
                            {
                                name: "Customer Service",
                                roles: ["Customer Service Representative", "Customer Service Manager"]
                            },
                            {
                                name: "Customer Support",
                                roles: ["Customer Support"]
                            },
                            {
                                name: "Customer Success",
                                roles: ["Customer Success"]
                            },
                        ]
                    },
                    {
                        name: "Creative & Design",
                        subcategories: [
                            {
                                name: "UI/UX Design",
                                roles: ["UX Designer", "UI Designer", "Graphic Designer", "UX Researcher"]
                            },
                            {
                                name: "Art/3D/Animation",
                                roles: ["Creative/Art Director", "Video Editor", "Illustrator", "3D Designer", "Motion Designer", "Animator"]
                            },
                            {
                                name: "Environmental Design",
                                roles: ["Interior Designer", "Landscape Designer"]
                            },
                            {
                                name: "Industrial Design",
                                roles: ["Industrial Designer"]
                            },
                        ]
                    },
                    {
                        name: "Logistics/Supply Chain",
                        subcategories: [
                            {
                                name: "Supply Chain Management",
                                roles: ["Supply Chain Manager", "Inventory Manager"]
                            },
                            {
                                name: "Logistics Operations",
                                roles: ["Logistics Manager", "Warehouse Manager", "Distribution Center Manager"]
                            },
                            {
                                name: "Procurement and Facilities",
                                roles: ["Procurement Manager", "Facilities Manager"]
                            },
                        ]
                    },
                    {
                        name: "Public Sector and Government",
                        subcategories: [
                            {
                                name: "Non-profit",
                                roles: ["Program Manager", "Volunteer Coordinator", "Fundraising Coordinator"]
                            },
                            {
                                name: "Policy and Planning",
                                roles: ["Policy Analyst"]
                            },
                            {
                                name: "Public Administration",
                                roles: ["Government Relations Manager"]
                            },
                        ]
                    },
                    {
                        name: "Legal Services",
                        subcategories: [
                            {
                                name: "Compliance & Risk Management",
                                roles: ["Risk Analyst", "Compliance Specialist"]
                            },
                            {
                                name: "Paralegals & Legal Support",
                                roles: ["Legal Assistant", "Paralegal"]
                            },
                            {
                                name: "Legal Operations & Administration",
                                roles: ["Case Manager", "Legal Operations Manager", "Court Clerk"]
                            },
                            {
                                name: "Legal Practice",
                                roles: ["Intellectual Property Lawyer", "Litigation Lawyer", "Immigration Lawyer", "Criminal Lawyer", "Family Lawyer"]
                            },
                        ]
                    },
                    {
                        name: "Education and Training",
                        subcategories: [
                            {
                                name: "Academic Teaching",
                                roles: ["Higher Education Teaching", "K-12 Teaching"]
                            },
                            {
                                name: "Corporate Training and Development",
                                roles: ["Corporate Training and Development"]
                            },
                            {
                                name: "Educational Administration",
                                roles: ["Educational Administration", "Academic Dean"]
                            },
                        ]
                    },
                    {
                        name: "Accounting",
                        subcategories: [
                            {
                                name: "Accounting",
                                roles: ["Accountant", "Controller"]
                            },
                            {
                                name: "Tax and Audit",
                                roles: ["Auditor", "Tax Specialist"]
                            },
                        ]
                    },
                    {
                        name: "Real Estate/Architecture",
                        subcategories: [
                            {
                                name: "Construction",
                                roles: ["Construction Project Manager", "Civil Engineer", "Structural Engineer"]
                            },
                            {
                                name: "Real Estate",
                                roles: ["Property Manager", "Leasing Consultant"]
                            },
                            {
                                name: "Architecture",
                                roles: ["Architect", "Urban Planner", "Landscape Architect"]
                            },
                        ]
                    },
                    {
                        name: "Energy/Environmental",
                        subcategories: [
                            {
                                name: "Energy Engineering",
                                roles: ["Renewable Energy Engineer", "Energy Engineer", "Power Systems Engineer", "Nuclear Engineer"]
                            },
                            {
                                name: "Environmental Engineering",
                                roles: ["Environmental Scientist", "Environmental Engineer"]
                            },
                        ]
                    },
                ],
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Cool, keeping it broad.";
                    return `Cool, ${Array.from(sel).join(' and ')} sound logical given your experience.`;
                }
            },
            {
                type: 'skills',
                lead: "Awesome. Now, what are your core skills or tools you use?",
                tags: [],
                placeholder: "e.g. Python, React, PyTorch",
                suggestions: ['Python', 'React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'Go', 'Rust', 'Ruby', 'PHP', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Git', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Generative AI', 'Data Science', 'Data Engineering', 'Figma', 'UI/UX', 'Product Management', 'Agile', 'Scrum', 'Sales', 'Marketing', 'SEO'],
                ackFunc: (sel) => {
                    if (!sel || !sel.length) return "Got it, keeping it broad.";
                    return `Great, ${sel.join(' and ')} are highly in demand.`;
                }
            },
            {
                type: 'experience',
                fieldId: 'experience',
                lead: "How many years of professional experience do you have?",
                slider: { min: 0, max: 40, value: 3, step: 1, prefix: '', unit: 'Years', label: 'Experience' },
                ackFunc: (sel) => {
                    return `Noted. ${sel} years of professional experience.`;
                }
            },
            {
                type: 'work-env',
                fieldId: 'work_mode',
                lead: "What work environment do you prefer?",
                chips: ['Remote', 'Hybrid', 'On-site'],
                multi: true,
                required: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Got it, keeping work environments open.";
                    return `You prefer ${Array.from(sel).join(', ').toLowerCase()}, let's find a location that fits.`;
                }
            },
            {
                type: 'employment-type',
                fieldId: 'employment_type',
                lead: "What type of employment are you open to?",
                chips: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
                multi: true,
                required: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "We'll keep all options open.";
                    return `Got it, focusing on ${Array.from(sel).join(', ')}.`;
                }
            },
            {
                type: 'location',
                fieldId: 'preferred_locations',
                lead: "Where would you like to work?",
                tags: ['Remote', 'San Francisco, CA'],
                placeholder: "Type a city or region and press Enter",
                suggestions: ['Specific city', 'Anywhere in India', 'International', 'Remote', 'Bengaluru, India', 'San Francisco, CA', 'New York, NY', 'London, UK'],
                ackFunc: (sel) => {
                    if (!sel || !sel.length) return "Great, I see you're open to various locations.";
                    return `Great, I see you're interested in ${sel.join(' and ')}.`;
                }
            },
            {
                type: 'relocation',
                fieldId: 'relocation',
                lead: "Are you willing to relocate for a suitable job?",
                chips: ['Yes', 'No', 'Maybe'],
                multi: false,
                required: true,
                ackFunc: (sel) => {
                    const chosen = sel ? Array.from(sel)[0] : 'Maybe';
                    return `Noted. Relocation preference: ${chosen}.`;
                }
            },
            {
                type: 'industries',
                fieldId: 'industries',
                lead: "Which industries are you interested in?",
                selectAll: true,
                chips: ['AI / ML', 'Software / IT', 'FinTech', 'Healthcare', 'E-Commerce', 'Education', 'Gaming', 'Automotive', 'Robotics', 'Energy', 'Finance', 'Consulting', 'Marketing', 'Media', 'Telecommunications', 'Manufacturing', 'Other'],
                multi: true,
                required: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Interesting mix. These are spaces where things change weekly.";
                    return `Interesting mix of ${Array.from(sel).join(', ')}. These are spaces where things change weekly.`;
                }
            },
            {
                type: 'company-size',
                fieldId: 'company_size',
                lead: "Thing is, it's totally different at a 10-person startup versus a big company. One's all chaos and ownership, the other's more stable but less direct impact.",
                sub: "What company size do you prefer?",
                multi: true,
                cards: [
                    { sub: '1-50 employees', title: 'Startup' },
                    { sub: '51-200 employees', title: 'Small' },
                    { sub: '201-500 employees', title: 'Medium' },
                    { sub: '501-1000 employees', title: 'Large' },
                    { sub: '1000+ employees', title: 'Enterprise' }
                ],
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Cool, open to all sizes.";
                    const titles = ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'];
                    const chosen = Array.from(sel).map(idx => titles[idx]);
                    return `Cool, ${chosen.join(' and ')} companies it is.`;
                }
            },
            {
                type: 'salary',
                fieldId: 'minimum_salary',
                lead: "Okay, the practical stuff, I need to know your salary expectations so I don't waste your time with roles that don't match.",
                sub: "What is your minimum expected salary or CTC?",
                slider: { min: 0, max: 100, value: 12, step: 1, prefix: '₹', unit: 'L /Year (CTC)', label: 'Minimum CTC' },
                ackFunc: (sel) => {
                    return `Perfect, a minimum CTC of ₹${sel}L helps narrow things down.`;
                }
            },
            {
                type: 'visa',
                fieldId: 'work_authorization',
                lead: "What is your current work authorization status?",
                chips: ['Indian citizen', 'Valid work authorization', 'Requires sponsorship', 'Not applicable'],
                multi: false,
                ackFunc: (sel) => {
                    const chosen = sel ? Array.from(sel)[0] : 'Valid work authorization';
                    return `Understood, work authorization set to ${chosen}.`;
                }
            },
            {
                type: 'regions',
                fieldId: 'remote_timezone',
                lead: "Which time zones are you comfortable working in for remote jobs?",
                selectAll: true,
                chips: ['India / IST', 'Asia', 'Middle East', 'Europe', 'North America', 'South America', 'Australia / Pacific', 'Any timezone'],
                multi: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Got it. Moving on.";
                    return `Got it, focusing on ${Array.from(sel).join(', ')}.`;
                }
            },
            {
                type: 'availability',
                fieldId: 'availability',
                lead: "When can you start?",
                chips: ['Immediately', 'Within 2 weeks', 'Within 1 month', '1-3 months', 'Specific date'],
                multi: false,
                ackFunc: (sel) => {
                    const chosen = sel ? Array.from(sel)[0] : 'Immediately';
                    return `Got it, available ${chosen.toLowerCase()}.`;
                }
            },
            {
                type: 'deal-breakers',
                fieldId: 'deal_breakers',
                lead: "What are your job deal-breakers?",
                sub: "If a job violates a selected deal-breaker, we will exclude the job.",
                chips: ['Salary below minimum', 'On-site work', 'Relocation', 'Night shifts', 'Specific industry', 'No sponsorship', 'Required skill missing', 'Other'],
                multi: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "No hard deal-breakers set, keeping all opportunities open.";
                    return `Noted. We will exclude any role violating your selected deal-breakers.`;
                }
            },
            {
                type: 'career-priorities',
                fieldId: 'career_priorities',
                lead: "What matters most to you in your next job?",
                sub: "Select up to 5 priorities.",
                chips: ['Salary', 'Career growth', 'Learning', 'Work-life balance', 'Remote / flexible work', 'Job security', 'Company reputation', 'Interesting work', 'Benefits'],
                multi: true,
                max: 5,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Understood, keeping a balanced approach.";
                    return `Got it, prioritizing ${Array.from(sel).join(', ')}.`;
                }
            },
            {
                type: 'post-age',
                fieldId: 'job_post_age',
                lead: "How recent should the job posting be?",
                chips: ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 60 days', 'Any'],
                multi: false,
                ackFunc: (sel) => {
                    const chosen = sel ? Array.from(sel)[0] : 'Last 30 days';
                    return `Okay, we'll focus on jobs posted in the ${chosen.toLowerCase()}.`;
                }
            },
            {
                type: 'outreach-tone',
                lead: "When we craft emails to recruiters, what tone and style do you prefer?",
                chips: ['Direct & Execution-focused (Standard)', 'Casual & Friendly', 'Formal & Professional', 'Creative & Bold'],
                multi: false,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "We'll use a standard tone.";
                    return `Great, we'll keep the outreach ${Array.from(sel)[0]}.`;
                }
            },
            {
                type: 'outreach-ai',
                lead: "Which AI Model should we use to generate your outreach messages and analyze jobs?",
                chips: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3.1'],
                multi: false,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "We'll use the default model.";
                    return `Noted. ${Array.from(sel)[0]} it is!`;
                }
            },
            {
                type: 'outreach-volume',
                lead: "We can automate your job search at scale. How many tailored applications would you like to send per week?",
                slider: { min: 5, max: 100, value: 20, step: 5, prefix: '', unit: 'Emails/Week', label: 'Outreach Volume' },
                ackFunc: (sel) => {
                    return `Awesome, aiming for ${sel} personalized emails a week.`;
                }
            },
            {
                type: 'personalization-focus',
                lead: "Our AI crafts hyper-personalized pitches for each recruiter. What should it focus on highlighting?",
                cards: [
                    { sub: 'Tools & Stack', title: 'Technical Skills' },
                    { sub: 'Numbers & Results', title: 'Past Impact' },
                    { sub: 'Values & Team', title: 'Cultural Fit' },
                    { sub: 'Short & Punchy', title: 'Direct Approach' }
                ],
                multi: true,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "We'll use a balanced approach.";
                    const titles = ['Technical Skills', 'Past Impact', 'Cultural Fit', 'Direct Approach'];
                    const chosen = Array.from(sel).map(idx => titles[idx]);
                    return `Got it, we'll focus on ${chosen.join(' and ')} in your pitches.`;
                }
            },
            {
                type: 'delivery-mode',
                lead: "Everything ships directly from your real Gmail address. How do you want to handle delivery?",
                chips: ['Drafts Only (I review first)', 'Auto-Send (Fire away)'],
                multi: false,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "Drafts only it is.";
                    return `Perfect, we'll set it to ${Array.from(sel)[0]}.`;
                }
            },
            {
                type: 'reply-handling',
                lead: "Our intelligent reply scanner will track opens and responses. How should we handle replies?",
                chips: ['Notify me immediately', 'Draft a suggested reply', 'Just leave it in my inbox'],
                multi: false,
                ackFunc: (sel) => {
                    if (!sel || sel.size === 0) return "We'll notify you.";
                    return `Great, we will ${Array.from(sel)[0].toLowerCase()}.`;
                }
            },
            {
                type: 'account',
                lead: "One quick thing before we dive into your matches, let's create your account so I can save all your preferences",
                form: ['Full Name', 'Email', 'Password']
            },
            {
                type: 'create-account',
                confirm: "Account Created & Profile Ready",
                sub: "I've personalized your candidate matching profile and can start ranking all eligible jobs with our hybrid matching algorithm.",
                final: true
            }
        ];

        /* ---------- State ---------- */
        let currentSection = 0;
        let maxRevealedSection = 0;
        let selections = {}; // per section
        let ackShown = {}; // track if acknowledgment is shown

        /* ---------- Build progress bar ---------- */
        const progressEl = document.getElementById('progress');
        sections.forEach((_, i) => {
            const seg = document.createElement('div');
            seg.className = 'seg' + (i === 0 ? ' active' : '');
            seg.dataset.idx = i;
            progressEl.appendChild(seg);
        });

        /* ---------- Render sections ---------- */
        const main = document.getElementById('main');

        const animatedSections = new Set();
        let scrollPositions = new Map();

        function render() {
            document.querySelectorAll('.pane-left, .pane-right').forEach(el => {
                if (el.id) scrollPositions.set(el.id, el.scrollTop);
            });

            main.innerHTML = '';
            sections.forEach((s, i) => {
                const el = document.createElement('section');
                let cName = 'section';
                if (i < currentSection) {
                    cName += ' passed';
                } else if (i === currentSection) {
                    cName += ' current';
                    if (!animatedSections.has(i)) {
                        cName += ' animate-reveal';
                        animatedSections.add(i);
                    }
                } else if (i <= maxRevealedSection) {
                    cName += ' passed';
                } else {
                    cName += ' upcoming';
                }
                el.className = cName;
                el.dataset.idx = i;
                el.id = `sec-${i}`;
                el.innerHTML = buildSection(s, i);
                main.appendChild(el);
            });
            attachHandlers();
            updateButtons();

            document.querySelectorAll('.pane-left, .pane-right').forEach(el => {
                if (el.id && scrollPositions.has(el.id)) {
                    el.scrollTop = scrollPositions.get(el.id);
                }
            });
        }

        function animateText(text, startIndex = 0) {
            if (!text) return { html: '', count: 0 };
            const words = text.trim().split(/\s+/);
            const html = words.map((word, index) => `<span class="word" style="animation-delay: ${(startIndex + index) * 0.06}s">${word}</span>`).join(' ');
            return { html, count: words.length };
        }

        function buildSection(s, i) {
            let html = '';

            let leadText = s.lead;
            if (s.type === 'industries') {
                leadText = "Now, let's zoom in a bit on the job itself, do you have any industries you really care about?";
            }

            let wordIndex = 0;
            if (leadText) {
                const res = animateText(leadText, wordIndex);
                wordIndex += res.count;
                html += `<p class="lead">${res.html}</p>`;
            }

            if (s.helper && s.type !== 'industries') {
                const res = animateText(s.helper, wordIndex);
                wordIndex += res.count;
                html += `<p class="helper">${res.html}</p>`;
            }

            if (s.sub) {
                const res = animateText(s.sub, wordIndex);
                wordIndex += res.count;
                html += `<p class="helper" style="margin-top:8px">${res.html}</p>`;
            }

            let delay = wordIndex * 0.06 + 0.4; // buffer before options reveal
            html += `<div class="options-wrapper" style="--delay: ${delay}s;">`;

            if (s.multi) {
                html += `<p class="select-all" data-idx="${i}" data-action="select-all">Select all</p>`;
            }

            if (s.type === 'job-function') {
                html += renderJobFunction(s, i);
            } else if (s.chips) {
                html += renderChips(s.chips, i, s.multi);
            } else if (s.cards) {
                html += renderCards(s.cards, i, s.multi);
            } else if (s.slider) {
                html += renderSlider(s.slider, i);
            } else if (s.form) {
                html += renderForm(s.form, i);
            } else if (s.tags !== undefined) {
                html += renderTagInput(s, i);
            } else if (s.confirm) {
                html += `<div class="confirm"><div class="check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12 L10 17 L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span>${s.confirm}</span></div>`;
            } else if (s.final) {
                html += renderShare();
            } else if (s.type === 'intro' && s.files) {
                html += renderFilePicker(s.files, i);
            }

            const ackText = s.ackFunc ? s.ackFunc(selections[i]) : s.ack;
            if (ackText) {
                const visClass = (i < currentSection || ackShown[i]) ? ' visible' : '';
                html += `<div class="ack${visClass}" id="ack-${i}">${animateText(ackText).html}</div>`;
            }

            html += `</div>`;

            return html;
        }

        function renderChips(chips, i, multi) {
            const sel = selections[i] || new Set();
            return `<div class="chips" data-idx="${i}">${chips.map(c => {
                const isSel = sel.has(c);
                return `<div class="chip ${isSel ? 'selected' : ''}" data-val="${c}"><span class="box"></span>${c}</div>`;
            }).join('')
                }</div>`;
        }

        function renderCards(cards, i, multi) {
            const sel = selections[i] || (multi ? new Set() : null);
            return `<div class="cards" data-idx="${i}">${cards.map((c, idx) => {
                const isSel = multi ? sel.has(idx) : sel === idx;
                return `<div class="card ${isSel ? 'selected' : ''}" data-idx="${idx}">
        <div class="icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="1.4"/><circle cx="12" cy="6" r="1.4"/><circle cx="18" cy="6" r="1.4"/><circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/><circle cx="6" cy="18" r="1.4"/><circle cx="12" cy="18" r="1.4"/><circle cx="18" cy="18" r="1.4"/></svg></div>
        <div>
          <p class="sub">${c.sub}</p>
          <p class="title">${c.title}</p>
        </div>
      </div>`;
            }).join('')
                }</div>`;
        }

        function renderSlider(s, i) {
            const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
            const prefix = s.prefix !== undefined ? s.prefix : '$';
            const unit = s.unit !== undefined ? s.unit : 'K /Year';
            const label = s.label !== undefined ? s.label : 'Minimum Salary';
            return `<div class="slider-card" data-idx="${i}">
    <div style="position:relative;display:flex;align-items:center;gap:8px">
      <div class="salary-display">
        ${prefix ? `<span class="dollar">${prefix}</span>` : ''}
        <span class="val">${s.value}</span>
        ${unit ? `<span class="unit">${unit}</span>` : ''}
        <div class="triangle"></div>
        <div class="label">${label}</div>
      </div>
    </div>
    <div class="slider-track" id="track-${i}">
      <div class="slider-fill" style="width:${pct}%"></div>
      <div class="slider-thumb" style="left:${pct}%"></div>
    </div>
  </div>`;
        }

        function renderForm(fields, i) {
            const values = selections[i] || ['', '', ''];
            return `<div class="form-card" data-idx="${i}">
    <div class="field"><label>Full Name</label><input data-field="0" type="text" placeholder="Mr Ab" value="${values[0] || ''}"></div>
    <div class="field"><label>Email</label><input data-field="1" type="email" placeholder="ab.work@g.com" value="${values[1] || ''}"></div>
    <div class="field"><label>Password</label><div class="password-wrap">
      <input data-field="2" type="password" placeholder="••••••••" value="${values[2] || ''}">
      <div class="icons">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="11" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
      </div>
    </div></div>
  </div>`;
        }

        function renderTagInput(s, i) {
            const tags = selections[i] || s.tags || [];
            return `<div class="tags-row">${tags.map(t => `<div class="tag">${t}<span class="x" data-rm="${t}">×</span></div>`).join('')
                }</div>
  <div class="taginput" data-idx="${i}">
    <input type="text" placeholder="${s.placeholder}" id="taginput-${i}">
    <div class="suggestions" id="sug-${i}" style="display:none"></div>
  </div>`;
        }

        function renderFilePicker(btns, i) {
            const files = selections[i] || [];
            const fileHTML = files.length ? `<div class="file-chip-row">${files.map(f => `<div class="file-chip">📄 ${f} <span class="x" data-rm="${f}">×</span></div>`).join('')
                }</div>` : `<div style="display:flex;gap:10px;margin-top:14px">${btns.map(b => `<button class="btn btn-skip" data-file="${b}">${b}</button>`).join('')
                }</div>`;
            return fileHTML;
        }

        function renderJobFunction(s, idx) {
            let searchQuery = (s._searchQuery || '').toLowerCase();
            let html = `
            <div class="job-function-container">
                <div class="job-search-wrap">
                    <input type="text" id="job-search-${idx}" class="job-search-input" placeholder="${s.placeholder || 'Please select/enter your expected job function'}" value="${s._searchQuery || ''}">
                </div>
                <div class="split-pane">
                    <div class="pane-left" id="pane-left-${idx}">`;

            // Filter categories based on search query
            let visibleCats = s.categories.map((cat, cIdx) => {
                let match = false;
                if (!searchQuery) match = true;
                else if (cat.name.toLowerCase().includes(searchQuery)) match = true;
                else if (cat.subcategories) {
                    for (let sub of cat.subcategories) {
                        if (sub.roles && sub.roles.some(r => r.toLowerCase().includes(searchQuery))) {
                            match = true; break;
                        }
                    }
                }
                return { cat, cIdx, match };
            }).filter(c => c.match);

            // Get the active category, default to first visible if current active is hidden
            let activeCidx = s._activeCategory || 0;
            if (visibleCats.length > 0 && !visibleCats.some(c => c.cIdx === activeCidx)) {
                activeCidx = visibleCats[0].cIdx;
            }

            visibleCats.forEach(({ cat, cIdx }) => {
                const activeClass = cIdx === activeCidx ? ' active' : '';
                html += `
                        <div class="cat-item${activeClass}" data-cidx="${cIdx}" data-idx="${idx}">
                            <span>${cat.name}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>`;
            });

            html += `
                    </div>
                    <div class="pane-right" id="pane-right-${idx}">
                        ${visibleCats.length > 0 ? renderJobRightPane(s.categories[activeCidx], idx, searchQuery) : '<p style="color:var(--muted-slate); font-size:14px;">No matching roles found.</p>'}
                    </div>
                </div>
            </div>`;
            return html;
        }

        function renderJobRightPane(cat, idx, searchQuery = '') {
            let html = `<h3 class="cat-title">${cat.name}</h3>`;
            if (cat.subcategories && cat.subcategories.length > 0) {
                cat.subcategories.forEach(sub => {
                    let rolesHtml = '';
                    let hasVisibleRoles = false;

                    if (sub.roles && sub.roles.length > 0) {
                        rolesHtml += `<div class="role-chips">`;
                        sub.roles.forEach(role => {
                            if (searchQuery && !role.toLowerCase().includes(searchQuery) && !cat.name.toLowerCase().includes(searchQuery)) return;
                            hasVisibleRoles = true;
                            const isSelected = selections[idx] && selections[idx].has(role);
                            const selClass = isSelected ? ' selected' : '';
                            rolesHtml += `<div class="role-chip${selClass}" data-idx="${idx}" data-role="${role}">${role}</div>`;
                        });
                        rolesHtml += `</div>`;
                    }

                    if (hasVisibleRoles) {
                        html += `<div class="sub-cat-group">`;
                        if (sub.name) {
                            html += `<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">`;
                            html += `<h4 class="sub-cat-title" style="margin-bottom: 0;">${sub.name}</h4>`;
                            html += `<p class="select-all-subcat" style="color: var(--text-primary); font-size: 13px; font-weight: 500; cursor: pointer; margin: 0; user-select: none;" data-idx="${idx}" data-subcat="${sub.name.replace(/"/g, '&quot;')}">Select all</p>`;
                            html += `</div>`;
                        }
                        html += rolesHtml;
                        html += `</div>`;
                    }
                });
            } else {
                html += `<p style="color:var(--text-secondary);font-family:var(--font-body);font-size:14px;">Please provide the secondary options for ${cat.name}.</p>`;
            }
            return html;
        }

        function renderShare() {
            return `<div class="share-row">
    <button class="btn btn-skip" id="skipBtn" style="margin-top:30px">Skip</button>
    <div class="share-input">
      <input type="text" placeholder="Share with Workin'" disabled>
      <div class="up"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12 L12 5 L19 12 M12 5 V19" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>
  </div>`;
        }

        /* ---------- Handlers ---------- */
        function showToast(msg) {
            const toast = document.getElementById('toastNotification');
            if (!toast) return;
            toast.textContent = msg;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }, 3200);
        }

        function openSignInModal() {
            const m = document.getElementById('signInModal');
            if (m) m.style.display = 'flex';
        }

        function closeSignInModal() {
            const m = document.getElementById('signInModal');
            if (m) m.style.display = 'none';
        }

        function handleSignIn() {
            const emailInp = document.getElementById('signInEmail');
            const email = emailInp ? emailInp.value.trim() : '';
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address.');
                return;
            }
            const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
            const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            
            const userAcc = { name: formattedName, email: email };
            localStorage.setItem('jobpath_user_account', JSON.stringify(userAcc));

            let profile = typeof getStoredProfile === 'function' ? getStoredProfile() : null;
            if (profile) {
                profile.candidate_name = formattedName;
                profile.candidate_email = email;
                if (typeof saveStoredProfile === 'function') saveStoredProfile(profile);
            }
            closeSignInModal();
            showToast(`Welcome back, ${formattedName}!`);
        }

        function loadDemoProfile() {
            const demo = {
                candidate_name: "Bhavya Amin",
                candidate_email: "bhavya.amin@example.com",
                target_roles: ["Backend Engineer", "Full Stack Engineer", "Python Engineer"],
                skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS", "REST APIs", "Redis", "Git"],
                experience: 4,
                work_mode: ["Remote", "Hybrid"],
                employment_type: ["Full-time"],
                preferred_locations: ["Remote", "Anywhere in India", "Bengaluru"],
                relocation: "Yes",
                industries: ["Software / IT", "AI / ML", "FinTech"],
                company_size: ["Startup: 1-50 employees", "Small: 51-200 employees", "Medium: 201-500 employees"],
                minimum_salary: 1800000,
                work_authorization: "Indian citizen",
                remote_timezone: ["India / IST", "Asia", "Europe"],
                availability: "Within 1 month",
                deal_breakers: ["Night shifts"],
                career_priorities: ["Salary", "Career growth", "Learning", "Work-life balance"],
                job_post_age: "Last 30 days"
            };

            if (typeof saveStoredProfile === 'function') {
                saveStoredProfile(demo);
                rankAllJobs(demo);
            }
            localStorage.setItem('jobpath_user_account', JSON.stringify({ name: demo.candidate_name, email: demo.candidate_email }));
            loadProfileIntoState(demo);
            closeSignInModal();
            showToast("Demo profile for Bhavya Amin loaded successfully!");
        }

        function applyParsedResume(parsed, fileName) {
            if (!selections[0]) selections[0] = [];
            if (!selections[0].includes(fileName)) selections[0].push(fileName);

            // Q1: Target Roles
            const q1Idx = sections.findIndex(s => s.type === 'job-function');
            if (q1Idx !== -1 && parsed.target_roles && parsed.target_roles.length > 0) {
                if (!selections[q1Idx]) selections[q1Idx] = new Set();
                parsed.target_roles.slice(0, 5).forEach(r => selections[q1Idx].add(r));
            }

            // Q2: Skills
            const q2Idx = sections.findIndex(s => s.type === 'skills');
            if (q2Idx !== -1 && parsed.skills && parsed.skills.length > 0) {
                if (!selections[q2Idx]) selections[q2Idx] = [];
                parsed.skills.forEach(sk => {
                    if (!selections[q2Idx].includes(sk)) selections[q2Idx].push(sk);
                });
            }

            // Q3: Experience
            const q3Idx = sections.findIndex(s => s.fieldId === 'experience');
            if (q3Idx !== -1 && parsed.experience_years !== undefined) {
                selections[q3Idx] = parsed.experience_years;
                if (sections[q3Idx].slider) sections[q3Idx].slider.value = parsed.experience_years;
            }

            // Account
            const accIdx = sections.findIndex(s => s.type === 'account');
            if (accIdx !== -1) {
                selections[accIdx] = [parsed.name || 'Bhavya Amin', parsed.email || 'bhavya.amin@example.com', '••••••••'];
            }

            render();
            showToast(`Parsed ${fileName}! Extracted ${parsed.skills ? parsed.skills.length : 0} skills & ${parsed.experience_years || 0} yrs experience.`);
        }

        function assembleCandidateProfile() {
            const profile = {
                candidate_name: "Bhavya Amin",
                candidate_email: "bhavya.amin@example.com",
                target_roles: [],
                skills: [],
                experience: 0,
                work_mode: ["Remote", "Hybrid"],
                employment_type: ["Full-time"],
                preferred_locations: ["Remote"],
                relocation: "Maybe",
                industries: ["Software / IT"],
                company_size: [],
                minimum_salary: 1200000,
                work_authorization: "Indian citizen",
                remote_timezone: ["India / IST"],
                availability: "Immediately",
                deal_breakers: [],
                career_priorities: [],
                job_post_age: "Last 30 days"
            };

            sections.forEach((sec, idx) => {
                const val = selections[idx];
                if (sec.type === 'job-function') {
                    if (val instanceof Set) profile.target_roles = Array.from(val);
                    else if (Array.isArray(val)) profile.target_roles = val;
                } else if (sec.type === 'skills') {
                    if (Array.isArray(val)) profile.skills = val;
                    else if (val instanceof Set) profile.skills = Array.from(val);
                } else if (sec.fieldId === 'experience') {
                    profile.experience = typeof val === 'number' ? val : (sec.slider ? sec.slider.value : 0);
                } else if (sec.fieldId === 'work_mode') {
                    if (val instanceof Set && val.size > 0) profile.work_mode = Array.from(val);
                } else if (sec.fieldId === 'employment_type') {
                    if (val instanceof Set && val.size > 0) profile.employment_type = Array.from(val);
                } else if (sec.fieldId === 'preferred_locations') {
                    if (Array.isArray(val) && val.length > 0) profile.preferred_locations = val;
                } else if (sec.fieldId === 'relocation') {
                    if (val instanceof Set && val.size > 0) profile.relocation = Array.from(val)[0];
                    else if (typeof val === 'string') profile.relocation = val;
                } else if (sec.fieldId === 'industries') {
                    if (val instanceof Set && val.size > 0) profile.industries = Array.from(val);
                } else if (sec.fieldId === 'company_size') {
                    const sizeMap = [
                        'Startup: 1-50 employees',
                        'Small: 51-200 employees',
                        'Medium: 201-500 employees',
                        'Large: 501-1000 employees',
                        'Enterprise: 1000+ employees'
                    ];
                    if (val instanceof Set) {
                        profile.company_size = Array.from(val).map(i => sizeMap[i] || i);
                    }
                } else if (sec.fieldId === 'minimum_salary') {
                    const lakh = typeof val === 'number' ? val : (sec.slider ? sec.slider.value : 12);
                    profile.minimum_salary = lakh * 100000;
                } else if (sec.fieldId === 'work_authorization') {
                    if (val instanceof Set && val.size > 0) profile.work_authorization = Array.from(val)[0];
                    else if (typeof val === 'string') profile.work_authorization = val;
                } else if (sec.fieldId === 'remote_timezone') {
                    if (val instanceof Set && val.size > 0) profile.remote_timezone = Array.from(val);
                } else if (sec.fieldId === 'availability') {
                    if (val instanceof Set && val.size > 0) profile.availability = Array.from(val)[0];
                    else if (typeof val === 'string') profile.availability = val;
                } else if (sec.fieldId === 'deal_breakers') {
                    if (val instanceof Set && val.size > 0) profile.deal_breakers = Array.from(val);
                } else if (sec.fieldId === 'career_priorities') {
                    if (val instanceof Set && val.size > 0) profile.career_priorities = Array.from(val);
                } else if (sec.fieldId === 'job_post_age') {
                    if (val instanceof Set && val.size > 0) profile.job_post_age = Array.from(val)[0];
                    else if (typeof val === 'string') profile.job_post_age = val;
                } else if (sec.type === 'account' && Array.isArray(val)) {
                    if (val[0]) profile.candidate_name = val[0];
                    if (val[1]) profile.candidate_email = val[1];
                }
            });

            const storedUser = localStorage.getItem('jobpath_user_account');
            if (storedUser) {
                try {
                    const u = JSON.parse(storedUser);
                    if (u.name) profile.candidate_name = u.name;
                    if (u.email) profile.candidate_email = u.email;
                } catch(e) {}
            }

            return profile;
        }

        function loadProfileIntoState(profile) {
            if (!profile) return;
            sections.forEach((sec, idx) => {
                if (sec.type === 'job-function' && profile.target_roles) {
                    selections[idx] = new Set(profile.target_roles);
                } else if (sec.type === 'skills' && profile.skills) {
                    selections[idx] = [...profile.skills];
                } else if (sec.fieldId === 'experience' && profile.experience !== undefined) {
                    selections[idx] = profile.experience;
                    if (sec.slider) sec.slider.value = profile.experience;
                } else if (sec.fieldId === 'work_mode' && profile.work_mode) {
                    selections[idx] = new Set(profile.work_mode);
                } else if (sec.fieldId === 'employment_type' && profile.employment_type) {
                    selections[idx] = new Set(profile.employment_type);
                } else if (sec.fieldId === 'preferred_locations' && profile.preferred_locations) {
                    selections[idx] = [...profile.preferred_locations];
                } else if (sec.fieldId === 'relocation' && profile.relocation) {
                    selections[idx] = new Set([profile.relocation]);
                } else if (sec.fieldId === 'industries' && profile.industries) {
                    selections[idx] = new Set(profile.industries);
                } else if (sec.fieldId === 'company_size' && profile.company_size) {
                    const sizeMap = {
                        'Startup: 1-50 employees': 0,
                        'Small: 51-200 employees': 1,
                        'Medium: 201-500 employees': 2,
                        'Large: 501-1000 employees': 3,
                        'Enterprise: 1000+ employees': 4
                    };
                    const s = new Set();
                    profile.company_size.forEach(item => {
                        if (typeof item === 'number') s.add(item);
                        else if (sizeMap[item] !== undefined) s.add(sizeMap[item]);
                    });
                    selections[idx] = s;
                } else if (sec.fieldId === 'minimum_salary' && profile.minimum_salary !== undefined) {
                    const lakh = Math.round(profile.minimum_salary / 100000);
                    selections[idx] = lakh;
                    if (sec.slider) sec.slider.value = lakh;
                } else if (sec.fieldId === 'work_authorization' && profile.work_authorization) {
                    selections[idx] = new Set([profile.work_authorization]);
                } else if (sec.fieldId === 'remote_timezone' && profile.remote_timezone) {
                    selections[idx] = new Set(profile.remote_timezone);
                } else if (sec.fieldId === 'availability' && profile.availability) {
                    selections[idx] = new Set([profile.availability]);
                } else if (sec.fieldId === 'deal_breakers' && profile.deal_breakers) {
                    selections[idx] = new Set(profile.deal_breakers);
                } else if (sec.fieldId === 'career_priorities' && profile.career_priorities) {
                    selections[idx] = new Set(profile.career_priorities);
                } else if (sec.fieldId === 'job_post_age' && profile.job_post_age) {
                    selections[idx] = new Set([profile.job_post_age]);
                } else if (sec.type === 'account') {
                    selections[idx] = [profile.candidate_name || '', profile.candidate_email || '', '••••••••'];
                }
            });
            render();
        }

        function validateSection(idx) {
            const s = sections[idx];
            if (!s) return true;
            const sel = selections[idx];

            if (s.type === 'job-function') {
                if (!sel || !(sel instanceof Set) || sel.size === 0) {
                    showToast("Please select at least 1 target role to continue.");
                    return false;
                }
            } else if (s.type === 'skills') {
                if (!sel || !Array.isArray(sel) || sel.length === 0) {
                    showToast("Please add at least 1 skill or technology.");
                    return false;
                }
            } else if (s.fieldId === 'work_mode') {
                if (!sel || !(sel instanceof Set) || sel.size === 0) {
                    showToast("Please choose at least 1 work environment (Remote, Hybrid, On-site).");
                    return false;
                }
            } else if (s.fieldId === 'employment_type') {
                if (!sel || !(sel instanceof Set) || sel.size === 0) {
                    showToast("Please choose at least 1 employment type.");
                    return false;
                }
            } else if (s.fieldId === 'preferred_locations') {
                if (!sel || !Array.isArray(sel) || sel.length === 0) {
                    showToast("Please specify at least 1 location preference.");
                    return false;
                }
            } else if (s.fieldId === 'relocation') {
                if (!sel || !(sel instanceof Set) || sel.size === 0) {
                    showToast("Please select your relocation preference.");
                    return false;
                }
            } else if (s.fieldId === 'industries') {
                if (!sel || !(sel instanceof Set) || sel.size === 0) {
                    showToast("Please select at least 1 industry of interest.");
                    return false;
                }
            } else if (s.type === 'account') {
                if (!sel || !Array.isArray(sel) || !sel[0] || !sel[1] || !sel[1].includes('@')) {
                    showToast("Please enter your name and a valid email address.");
                    return false;
                }
            }

            return true;
        }

        function onStartMatching() {
            const profile = assembleCandidateProfile();
            if (!profile.target_roles || profile.target_roles.length === 0) {
                showToast("Please select at least one target role before matching.");
                return;
            }

            if (typeof saveStoredProfile === 'function') {
                saveStoredProfile(profile);
            } else {
                localStorage.setItem('jobpath_candidate_profile', JSON.stringify(profile));
            }

            const userAcc = {
                name: profile.candidate_name || "Bhavya Amin",
                email: profile.candidate_email || "bhavya.amin@example.com"
            };
            localStorage.setItem('jobpath_user_account', JSON.stringify(userAcc));

            if (typeof rankAllJobs === 'function') {
                rankAllJobs(profile);
            }

            window.location.href = 'splash-loader.html';
        }

        function attachHandlers() {
            // job search bar
            document.querySelectorAll('.job-search-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = +e.target.id.split('-')[2];
                    sections[idx]._searchQuery = e.target.value;
                    render();

                    const newEl = document.getElementById(e.target.id);
                    if (newEl) {
                        newEl.focus();
                        newEl.setSelectionRange(e.target.value.length, e.target.value.length);
                    }
                });
            });

            // job function split pane
            document.querySelectorAll('.cat-item').forEach(c => {
                c.addEventListener('click', () => {
                    const cIdx = +c.dataset.cidx;
                    const idx = +c.dataset.idx;
                    sections[idx]._activeCategory = cIdx;
                    render();
                });
            });

            document.querySelectorAll('.role-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const idx = +chip.dataset.idx;
                    const role = chip.dataset.role;
                    if (!selections[idx]) selections[idx] = new Set();
                    if (selections[idx].has(role)) {
                        selections[idx].delete(role);
                    } else {
                        if (selections[idx].size >= 5) {
                            showToast("You can select up to 5 target roles maximum.");
                            return;
                        }
                        selections[idx].add(role);
                    }
                    render();
                });
            });

            document.querySelectorAll('.select-all-subcat').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = +btn.dataset.idx;
                    const subcatName = btn.dataset.subcat;
                    const s = sections[idx];
                    const activeCidx = s._activeCategory || 0;
                    const sub = s.categories[activeCidx].subcategories.find(sc => sc.name === subcatName);
                    if (sub && sub.roles) {
                        if (!selections[idx]) selections[idx] = new Set();
                        const allSelected = sub.roles.every(role => selections[idx].has(role));
                        if (allSelected) {
                            sub.roles.forEach(role => selections[idx].delete(role));
                        } else {
                            sub.roles.forEach(role => {
                                if (selections[idx].size < 5) {
                                    selections[idx].add(role);
                                }
                            });
                            if (selections[idx].size >= 5) {
                                showToast("Reached 5 target roles maximum.");
                            }
                        }
                        render();
                    }
                });
            });

            // chips
            document.querySelectorAll('.chips').forEach(c => {
                const idx = +c.dataset.idx;
                const s = sections[idx];
                const multi = s.multi;
                c.querySelectorAll('.chip').forEach(chip => {
                    chip.addEventListener('click', () => {
                        if (!selections[idx]) selections[idx] = new Set();
                        const v = chip.dataset.val;
                        if (multi) {
                            if (selections[idx].has(v)) {
                                selections[idx].delete(v);
                            } else {
                                if (s.max && selections[idx].size >= s.max) {
                                    showToast(`You can select up to ${s.max} options maximum.`);
                                    return;
                                }
                                selections[idx].add(v);
                            }
                        } else {
                            selections[idx] = new Set([v]);
                        }
                        render();
                    });
                });
            });

            // cards
            document.querySelectorAll('.cards').forEach(c => {
                const idx = +c.dataset.idx;
                const multi = sections[idx].multi;
                c.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', () => {
                        const val = +card.dataset.idx;
                        if (multi) {
                            if (!selections[idx]) selections[idx] = new Set();
                            if (selections[idx].has(val)) selections[idx].delete(val);
                            else selections[idx].add(val);
                        } else {
                            selections[idx] = val;
                        }
                        render();
                    });
                });
            });

            // slider
            document.querySelectorAll('.slider-card').forEach(c => {
                const idx = +c.dataset.idx;
                const track = document.getElementById(`track-${idx}`);
                let dragging = false;
                const update = (e) => {
                    const rect = track.getBoundingClientRect();
                    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                    let pct = Math.max(0, Math.min(1, x / rect.width));
                    const s = sections[idx].slider;
                    const raw = s.min + pct * (s.max - s.min);
                    const v = Math.round(raw / s.step) * s.step;
                    s.value = v;
                    pct = (v - s.min) / (s.max - s.min);
                    track.querySelector('.slider-fill').style.width = (pct * 100) + '%';
                    track.querySelector('.slider-thumb').style.left = (pct * 100) + '%';
                    c.querySelector('.val').textContent = v;
                    selections[idx] = v;
                };
                track.addEventListener('mousedown', (e) => { dragging = true; update(e); });
                document.addEventListener('mousemove', (e) => { if (dragging) update(e); });
                document.addEventListener('mouseup', () => {
                    if (dragging) { dragging = false; }
                });
                track.addEventListener('touchstart', (e) => { dragging = true; update(e); });
                track.addEventListener('touchmove', (e) => { if (dragging) update(e); });
                track.addEventListener('touchend', () => { if (dragging) { dragging = false; } });
            });

            // form
            document.querySelectorAll('.form-card').forEach(c => {
                const idx = +c.dataset.idx;
                if (!selections[idx]) selections[idx] = ['', '', ''];
                c.querySelectorAll('input').forEach(inp => {
                    inp.addEventListener('input', (e) => {
                        selections[idx][+inp.dataset.field] = e.target.value;
                        updateButtons();
                    });
                });
            });

            // tag input
            document.querySelectorAll('.taginput').forEach(t => {
                const idx = +t.dataset.idx;
                const input = document.getElementById(`taginput-${idx}`);
                const sug = document.getElementById(`sug-${idx}`);
                if (selections[idx] === undefined) selections[idx] = [...(sections[idx].tags || [])];

                if (input) {
                    input.addEventListener('input', (e) => {
                        const v = e.target.value;
                        const all = sections[idx].suggestions || [];
                        if (!v) { sug.style.display = 'none'; return; }
                        const currentSelected = selections[idx] || [];
                        const filtered = all.filter(s => !currentSelected.includes(s) && s.toLowerCase().includes(v.toLowerCase()));
                        if (!filtered.length) { sug.style.display = 'none'; return; }
                        sug.innerHTML = filtered.map(f => {
                            const i = f.toLowerCase().indexOf(v.toLowerCase());
                            const before = f.slice(0, i);
                            const match = f.slice(i, i + v.length);
                            const after = f.slice(i + v.length);
                            return `<div class="sug" data-val="${f}"><b>${before}${match}</b><span>${after}</span></div>`;
                        }).join('');
                        sug.style.display = 'block';
                        sug.querySelectorAll('.sug').forEach(s => {
                            s.addEventListener('click', () => {
                                addTag(idx, s.dataset.val);
                                input.value = '';
                                sug.style.display = 'none';
                            });
                        });
                    });
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && input.value.trim()) {
                            e.preventDefault();
                            addTag(idx, input.value.trim());
                            input.value = '';
                            sug.style.display = 'none';
                        }
                    });
                }
            });

            // remove tags
            document.querySelectorAll('[data-rm]').forEach(x => {
                x.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sec = currentSection;
                    if (selections[sec] && Array.isArray(selections[sec])) {
                        selections[sec] = selections[sec].filter(t => t !== x.dataset.rm);
                        render();
                    }
                });
            });

            // file picker buttons
            document.querySelectorAll('[data-file]').forEach(b => {
                b.addEventListener('click', () => {
                    const v = b.dataset.file;
                    if (v.toLowerCase().includes('resume')) {
                        const fileInput = document.getElementById('resumeFileInput');
                        if (fileInput) fileInput.click();
                        return;
                    }
                    if (!selections[currentSection]) selections[currentSection] = [];
                    if (!selections[currentSection].includes(v)) selections[currentSection].push(v);
                    render();
                });
            });

            // select all
            document.querySelectorAll('[data-action="select-all"]').forEach(el => {
                el.addEventListener('click', () => {
                    const idx = +el.dataset.idx;
                    const s = sections[idx];
                    if (s.chips) {
                        if (selections[idx] && selections[idx].size === s.chips.length) {
                            selections[idx] = new Set();
                        } else {
                            if (s.max) {
                                selections[idx] = new Set(s.chips.slice(0, s.max));
                            } else {
                                selections[idx] = new Set(s.chips);
                            }
                        }
                    } else if (s.cards) {
                        if (selections[idx] && selections[idx].size === s.cards.length) {
                            selections[idx] = new Set();
                        } else {
                            selections[idx] = new Set(s.cards.map((_, i) => i));
                        }
                    }
                    render();
                });
            });

            // skip button
            document.querySelectorAll('#skipBtn, .btn-skip').forEach(btn => {
                if (!btn.dataset.file) {
                    btn.addEventListener('click', () => {
                        const next = document.getElementById('nextBtn');
                        if (next) next.click();
                    });
                }
            });
        }

        function addTag(idx, v) {
            if (!selections[idx]) selections[idx] = [...(sections[idx].tags || [])];
            if (!selections[idx].includes(v)) selections[idx].push(v);
            render();
        }

        function i(idx) { return idx; }

        function updateProgress(activeIdx) {
            document.querySelectorAll('.progress .seg').forEach((s, i) => {
                s.classList.toggle('active', i <= activeIdx);
            });
        }

        function updateButtons() {
            const prev = document.getElementById('prevBtn');
            const next = document.getElementById('nextBtn');
            const s = sections[currentSection];
            if (!prev || !next) return;

            prev.disabled = currentSection === 0;
            if (s && s.final) {
                next.style.display = 'none';
                const smb = document.getElementById('startMatchingBtn');
                if (smb) smb.style.display = 'inline-flex';
            } else {
                next.style.display = '';
                const smb = document.getElementById('startMatchingBtn');
                if (smb) smb.style.display = 'none';
            }
            prev.style.display = currentSection === 0 ? 'none' : '';

            const sel = selections[currentSection];
            let enabled = false;
            if (sel instanceof Set) enabled = sel.size > 0;
            else if (Array.isArray(sel)) {
                if (s.form) enabled = sel.every(v => v && v.length > 0);
                else enabled = sel.length > 0;
            }
            else if (typeof sel === 'number') enabled = true;
            else enabled = currentSection > 0 || currentSection === 0;
            next.disabled = !enabled;

            next.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (!validateSection(currentSection)) {
                return;
            }

            const s = sections[currentSection];

            if (s && (s.ack || s.ackFunc) && !ackShown[currentSection]) {
                const ackEl = document.getElementById(`ack-${currentSection}`);
                if (ackEl) {
                    const freshAckText = s.ackFunc ? s.ackFunc(selections[currentSection]) : s.ack;
                    ackEl.innerHTML = animateText(freshAckText).html;
                    ackEl.classList.add('visible');
                    ackEl.classList.add('animate-reveal-ack');

                    setTimeout(() => {
                        void ackEl.offsetHeight;
                        const rect = ackEl.getBoundingClientRect();
                        const finalBottom = rect.top + ackEl.scrollHeight + 32;
                        const safeBottom = window.innerHeight - 120;
                        if (finalBottom > safeBottom) {
                            const scrollAmount = finalBottom - safeBottom;
                            window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                        }
                    }, 50);
                }
                ackShown[currentSection] = true;
                updateButtons();
                return;
            }

            if (currentSection < sections.length - 1) {
                const oldSec = document.getElementById(`sec-${currentSection}`);
                if (oldSec) {
                    oldSec.classList.remove('current');
                    oldSec.classList.add('passed');
                }
                currentSection++;
                maxRevealedSection = Math.max(maxRevealedSection, currentSection);
                updateProgress(currentSection);
                const sec = document.getElementById(`sec-${currentSection}`);
                if (sec) {
                    sec.classList.remove('upcoming');
                    sec.classList.add('current');
                    if (!animatedSections.has(currentSection)) {
                        sec.classList.add('animate-reveal');
                        animatedSections.add(currentSection);
                    }
                    const top = sec.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (sec.offsetHeight / 2);
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                updateButtons();
            }
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentSection > 0) {
                const oldSec = document.getElementById(`sec-${currentSection}`);
                if (oldSec) {
                    oldSec.classList.remove('current');
                    oldSec.classList.add('upcoming');
                }
                currentSection--;
                updateProgress(currentSection);
                const sec = document.getElementById(`sec-${currentSection}`);
                if (sec) {
                    sec.classList.remove('passed');
                    sec.classList.add('current');
                    const top = sec.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (sec.offsetHeight / 2);
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                updateButtons();
            }
        });

        // Resume file input change listener
        const resumeFileInput = document.getElementById('resumeFileInput');
        if (resumeFileInput) {
            resumeFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    showToast(`Parsing ${file.name}...`);
                    const parsed = (typeof parseUploadedResume === 'function') 
                        ? parseUploadedResume(file.name)
                        : {
                            name: "Bhavya Amin",
                            email: "bhavya.amin@example.com",
                            skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS", "REST APIs", "Redis", "Git"],
                            experience_years: 4,
                            target_roles: ["Backend Engineer", "Full Stack Engineer"],
                            education: "B.Tech Computer Science"
                        };
                    applyParsedResume(parsed, file.name);
                }
            });
        }

        // detect scroll to update currentSection
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                let active = 0;
                sections.forEach((_, i) => {
                    const el = document.getElementById(`sec-${i}`);
                    if (el && !el.classList.contains('upcoming')) {
                        const r = el.getBoundingClientRect();
                        if (r.top < window.innerHeight * 0.6) active = i;
                    }
                });
                if (active !== currentSection) {
                    document.querySelectorAll('.section').forEach((sec, i) => {
                        if (i < active) { sec.classList.remove('current', 'upcoming'); sec.classList.add('passed'); }
                        else if (i === active) { sec.classList.remove('passed', 'upcoming'); sec.classList.add('current'); }
                        else if (i <= maxRevealedSection) { sec.classList.remove('current', 'upcoming'); sec.classList.add('passed'); }
                    });
                    currentSection = active;
                    maxRevealedSection = Math.max(maxRevealedSection, currentSection);
                    updateProgress(currentSection);
                    updateButtons();
                }
            }, 100);
        });

        // Auto restore existing saved profile if present
        const existingProfile = typeof getStoredProfile === 'function' ? getStoredProfile() : null;
        if (existingProfile) {
            loadProfileIntoState(existingProfile);
        } else {
            render();
        }