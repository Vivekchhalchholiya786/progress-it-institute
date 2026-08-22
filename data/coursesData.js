/**
 * Progress IT Institute - Courses Database
 * Contains details, syllabus, benefits, and schedule for all modules.
 */

const coursesData = {
    // ==========================================
    //  SAP MODULES
    // ==========================================
    "sap-fico": {
        id: "sap-fico",
        title: "SAP FICO (Financial Accounting & Controlling)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 - 3.5 Months",
        format: "Classroom & Online",
        projects: "Live Business Integration",
        certification: "SAP Certified Application Associate Exam Prep",
        about: "SAP FICO stands for Financial Accounting (FI) and Controlling (CO). It is one of the most widely implemented SAP modules in organizations globally. This course provides comprehensive training on accounting processes, ledger configuration, asset management, and cost center accounting, preparing you for senior consultant roles.",
        details: {
            audience: "Commerce Graduates, CA/ICWA Professionals, Finance Executives, and IT Graduates looking to pivot into SAP consulting.",
            prerequisites: "Basic understanding of accounting principles (Debit/Credit) is recommended. No coding experience required.",
            roles: "SAP FICO Consultant, General Ledger Accountant, Financial Analyst, SAP Support Consultant.",
            salary: "₹5.5 LPA - ₹12 LPA (depending on experience)"
        },
        benefits: [
            "100% Practical and Hands-on SAP Server Access (ECC / S/4HANA)",
            "Real-time Enterprise Structure configuration from scratch",
            "Mentored by SAP Certified Industry Consultants with 8+ years experience",
            "Comprehensive CV preparation & Mock Interviews aligned with MNC expectations",
            "Preparation support for SAP Global Certification exam"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM OR 7:00 PM - 9:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 2:00 PM)",
            nextBatch: "Every Monday"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: SAP Overview & Enterprise Structure",
                topics: [
                    "Introduction to ERP and SAP (ECC & S/4HANA Architecture)",
                    "Creation of Company, Company Code, and Business Area",
                    "Defining Fiscal Year Variant and Posting Period Variant",
                    "Chart of Accounts and Account Groups configuration"
                ]
            },
            {
                moduleTitle: "Module 2: General Ledger Accounting (FI-GL)",
                topics: [
                    "GL Master Record creation and maintenance",
                    "Document Posting, Parking, Holding, and Reversals",
                    "Foreign Currency Valuation",
                    "General Ledger reporting and Financial Statements creation"
                ]
            },
            {
                moduleTitle: "Module 3: Accounts Payable & Accounts Receivable (FI-AP / FI-AR)",
                topics: [
                    "Vendor and Customer Master Groups and creation",
                    "Invoicing, Credit Memos, and Payments (Manual & Automatic Payment Program - APP)",
                    "Dunning configuration (Automatic Customer Reminders)",
                    "Integration with Materials Management (MM) and Sales & Distribution (SD)"
                ]
            },
            {
                moduleTitle: "Module 4: Asset Accounting (FI-AA)",
                topics: [
                    "Chart of Depreciation and Asset Classes",
                    "Acquisition, Transfer, and Retirement of Assets",
                    "Depreciation Run configuration and execution",
                    "Asset Explorer and reporting"
                ]
            },
            {
                moduleTitle: "Module 5: Controlling & Cost Accounting (CO)",
                topics: [
                    "Controlling Area settings and activation",
                    "Cost Centers, Cost Elements (Primary & Secondary), and Activity Types",
                    "Internal Orders configuration and settlements",
                    "Profit Center master records and allocation rules"
                ]
            }
        ]
    },
    "sap-mm": {
        id: "sap-mm",
        title: "SAP MM (Materials Management)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 - 3 Months",
        format: "Classroom & Online",
        projects: "Procurement Lifecycle Integration",
        certification: "SAP MM Global Certification Prep",
        about: "SAP Materials Management (MM) manages the procurement activity of an organization from procurement of raw materials to stock inventory management. In this module, you will learn purchasing flows, material master records, valuation, invoice verification, and inventory control procedures.",
        details: {
            audience: "Supply Chain Professionals, Mechanical/Industrial Engineers, MBA Operations Graduates, and Logistics personnel.",
            prerequisites: "Basic familiarity with supply chain operations and business procurement steps.",
            roles: "SAP MM Consultant, Procurement Officer, Supply Chain Analyst, Material Planner.",
            salary: "₹4.5 LPA - ₹10 LPA"
        },
        benefits: [
            "Access to real SAP S/4HANA sandbox database",
            "Configuring complex pricing schemas and automatic account determination",
            "Practical training in inventory valuation (LIFO, FIFO, Moving Average)",
            "Integrated mock runs simulating actual corporate warehouse operations",
            "Resume enhancement and placement assurance"
        ],
        schedule: {
            weekday: "Monday - Friday (10:30 AM - 12:30 PM)",
            weekend: "Saturday & Sunday (3:00 PM - 7:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Enterprise Structure in Procurement",
                topics: [
                    "Defining Plant, Storage Location, Purchasing Organization, and Groups",
                    "Assigning Organizatonal Units to Enterprise Structure",
                    "Understanding Material Types and Industry Sectors"
                ]
            },
            {
                moduleTitle: "Module 2: Master Data in SAP MM",
                topics: [
                    "Material Master Configuration and maintenance",
                    "Vendor Master (Business Partner) configuration",
                    "Purchase Info Record (PIR) and Source Lists"
                ]
            },
            {
                moduleTitle: "Module 3: Procurement Cycle (P2P)",
                topics: [
                    "Purchase Requisition (PR) creation and release strategy",
                    "Request for Quotation (RFQ) and Price Comparison",
                    "Purchase Order (PO) processing and approval flows",
                    "Goods Receipt (GR) and Invoice Verification (LIV)"
                ]
            },
            {
                moduleTitle: "Module 4: Inventory Management & Physical Inventory",
                topics: [
                    "Movement Types and stock transfers (Plant-to-Plant, Sloc-to-Sloc)",
                    "Subcontracting and Consignment scenarios",
                    "Physical Inventory document processing and difference postings"
                ]
            },
            {
                moduleTitle: "Module 5: Integration & Pricing Schema",
                topics: [
                    "Condition types and Schema Groups configuration",
                    "Automatic Account Determination (MM-FI integration via OBYC)",
                    "Service Procurement and Outline Agreements (Contracts & Scheduling Agreements)"
                ]
            }
        ]
    },
    "sap-sd": {
        id: "sap-sd",
        title: "SAP SD (Sales & Distribution)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 - 3 Months",
        format: "Classroom & Online",
        projects: "Order-to-Cash (O2C) Business Case",
        certification: "SAP Sales & Distribution Application Prep",
        about: "SAP Sales & Distribution (SD) controls all processes starting from customer enquiry, quotation, sales order, delivery, transportation, up to customer billing and credit tracking. This course offers rigorous, scenario-based learning of customer touchpoints.",
        details: {
            audience: "MBA Marketing graduates, Sales Executives, Supply Chain Specialists, and IT professionals.",
            prerequisites: "Understanding of standard corporate sales and invoicing concepts.",
            roles: "SAP SD Functional Consultant, Business Systems Analyst, Sales Ops Consultant.",
            salary: "₹5 LPA - ₹11 LPA"
        },
        benefits: [
            "Complete Order-to-Cash (O2C) integration cycle configuration",
            "Specialized training in Pricing Conditions, Access Sequences, and Taxes",
            "Interaction scenarios: Third-Party Sales & Consignment Stocks",
            "Expert advice on preparing and clearing the SAP SD Certification exam",
            "Interview practice with real MNC case studies"
        ],
        schedule: {
            weekday: "Monday - Friday (1:00 PM - 3:00 PM)",
            weekend: "Saturday & Sunday (12:00 PM - 4:00 PM)",
            nextBatch: "First Monday of every month"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Enterprise Structure in SD",
                topics: [
                    "Defining Sales Organization, Distribution Channel, and Division (Sales Area)",
                    "Assigning Sales Area elements and Sales Offices/Groups",
                    "Defining Shipping Points and Loading Points"
                ]
            },
            {
                moduleTitle: "Module 2: Master Data in Sales",
                topics: [
                    "Customer Master (Business Partner) configuration and settings",
                    "Material Master setup for Sales perspective",
                    "Customer-Material Info Records configuration"
                ]
            },
            {
                moduleTitle: "Module 3: Sales Order Processing (O2C)",
                topics: [
                    "Inquiry, Quotation, and Sales Order creation",
                    "Special Sales Orders: Rush Orders, Cash Sales, Free-of-charge deliveries",
                    "Incompletion Log and Item Categories determination"
                ]
            },
            {
                moduleTitle: "Module 4: Shipping, Delivery & Billing",
                topics: [
                    "Delivery processing: Picking, Packing, and Post Goods Issue (PGI)",
                    "Shipping Point determination rules",
                    "Billing document creation (Invoices, Credit/Debit Memos)"
                ]
            },
            {
                moduleTitle: "Module 5: Pricing & Integration",
                topics: [
                    "Condition Technique: Condition Types, Access Sequences, Pricing Procedures",
                    "SD-FI Integration (Revenue Account Determination)",
                    "SD-MM Integration (Transfer of Requirements & Availability Check - Availability to Promise)"
                ]
            }
        ]
    },
    "sap-pp": {
        id: "sap-pp",
        title: "SAP PP (Production Planning)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 - 3 Months",
        format: "Classroom & Online",
        projects: "Discrete & Repetitive Manufacturing setup",
        certification: "SAP PP Associate Exam Prep",
        about: "SAP PP handles the planning and execution processes of product manufacturing. It integrates with material management, quality management, and finance to track production capacity, bill of materials, routing configurations, and material requirement planning (MRP).",
        details: {
            audience: "Manufacturing Engineers, Operations Managers, MBA Operations, and Technical Consultants.",
            prerequisites: "General knowledge of manufacturing plant setups and material requirements.",
            roles: "SAP PP Consultant, Production Planner, SAP Logistics Consultant.",
            salary: "₹4.8 LPA - ₹10.5 LPA"
        },
        benefits: [
            "Practical Discrete, Repetitive, and Process manufacturing scenarios",
            "Configuring Bill of Materials (BOM), Work Centers, and Routings",
            "Hands-on MRP runs and capacity scheduling configurations",
            "1-on-1 resume reviews and mock interviews",
            "Real SAP sandbox environment for independent practice"
        ],
        schedule: {
            weekday: "Monday - Friday (3:00 PM - 5:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 2:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Production Planning Master Data",
                topics: [
                    "Material Master settings for Production",
                    "Bill of Materials (BOM) creation and configuration",
                    "Work Center definition, Cost Center assignment, and Capacity formulas",
                    "Routing creation, operations, and PRT assignment"
                ]
            },
            {
                moduleTitle: "Module 2: Sales and Operations Planning (SOP)",
                topics: [
                    "Standard SOP and Flexible SOP",
                    "Creating Product Groups and Sales Plans",
                    "Transferring SOP plans to Demand Management"
                ]
            },
            {
                moduleTitle: "Module 3: Material Requirement Planning (MRP)",
                topics: [
                    "MRP procedures (MRP vs MPS)",
                    "MRP parameters, Planning Run execution (MD01 / MD02)",
                    "Analyzing MRP Evaluation Lists and Stock/Requirement lists"
                ]
            },
            {
                moduleTitle: "Module 4: Discrete Manufacturing Execution",
                topics: [
                    "Production Order creation, release, and printing",
                    "Goods Issue of components and staging",
                    "Order confirmation and Goods Receipt (GR) of finished goods"
                ]
            },
            {
                moduleTitle: "Module 5: Repetitive & Process Manufacturing",
                topics: [
                    "Master Recipes and Resources configuration",
                    "Production Version management",
                    "Backflushing and planning tables"
                ]
            }
        ]
    },
    "sap-abap": {
        id: "sap-abap",
        title: "SAP ABAP (Advanced Business Application Programming)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "3 - 3.5 Months",
        format: "Classroom & Online",
        projects: "Custom Reports & Form Development",
        certification: "SAP ABAP Developer Associate Certification",
        about: "SAP ABAP is the high-level programming language used to customize and build applications on the SAP NetWeaver and S/4HANA platforms. This developer track covers basic coding structures, database interactions, classical/interactive reports, ALV Grid control, Smartforms, BadIs, BAPIs, and OData services.",
        details: {
            audience: "B.E./B.Tech/MCA/BSc IT Graduates, Programmers, and Software Engineers.",
            prerequisites: "Basic understanding of any programming language (C++, Java, Python) and SQL database concepts.",
            roles: "SAP ABAP Developer, SAP Technical Consultant, ABAP/HANA Engineer.",
            salary: "₹5.5 LPA - ₹13 LPA"
        },
        benefits: [
            "Coding in real SAP ABAP editor environment",
            "Transitioning from R/3 classic ABAP to ABAP on HANA constructs",
            "Building custom OData APIs and SAP Fiori UI integration projects",
            "Comprehensive code reviews by senior technical architects",
            "100% placement support in tier-1 IT companies"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM OR 6:30 PM - 8:30 PM)",
            weekend: "Saturday & Sunday (9:00 AM - 1:00 PM)",
            nextBatch: "Every Monday"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: ABAP Dictionary & Basic Syntax",
                topics: [
                    "Introduction to SAP Architecture & ABAP Workbench",
                    "Creating Tables, Data Elements, Domains, and Structures",
                    "Search Helps, Views, and Lock Objects",
                    "Basic Syntax, Control statements, and Internal Tables"
                ]
            },
            {
                moduleTitle: "Module 2: ABAP Open SQL & Modularization",
                topics: [
                    "Open SQL statements (Select, Insert, Update, Modify)",
                    "Subroutines and Function Modules",
                    "Object-Oriented ABAP concepts (Classes, Methods, Inheritance)"
                ]
            },
            {
                moduleTitle: "Module 3: Reports & Forms",
                topics: [
                    "Classical and Interactive Reporting",
                    "ALV Grid display using Function Modules and Object-Oriented methods",
                    "Designing print-layouts: Smartforms and Adobe Forms"
                ]
            },
            {
                moduleTitle: "Module 4: Enhancements & Conversions",
                topics: [
                    "Legacy System Migration Workbench (LSMW) and BDC scripts",
                    "User Exits, Customer Exits, and BAdIs (Business Add-Ins)",
                    "Understanding BAPIs and Remote Function Calls (RFC)"
                ]
            },
            {
                moduleTitle: "Module 5: Modern ABAP on HANA",
                topics: [
                    "Core Data Services (CDS) Views basics",
                    "AMDP (ABAP Managed Database Procedures) introduction",
                    "OData Services development using Gateway Builder (SEGW)"
                ]
            }
        ]
    },
    "sap-successfactors": {
        id: "sap-successfactors",
        title: "SAP SuccessFactors / HCM",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 - 3 Months",
        format: "Classroom & Online",
        projects: "Global HR Cloud Provisioning",
        certification: "SAP SuccessFactors Core HR Exam Prep",
        about: "SAP SuccessFactors is a cloud-based human capital management (HCM) software system. This module trains you in configuring core HR actions, employee profiles, recruiting pipelines, performance evaluations, and compensation dashboards on the cloud console.",
        details: {
            audience: "HR Professionals, MBA HR Graduates, and Functional Consultants.",
            prerequisites: "General knowledge of human resource operations (Recruitment, Payroll, Onboarding).",
            roles: "SAP SuccessFactors Consultant, HCM Solution Specialist, HR Systems Analyst.",
            salary: "₹5 LPA - ₹11.5 LPA"
        },
        benefits: [
            "Access to live SuccessFactors Provisioning Instance",
            "Configuring Employee Central & Role-Based Permissions (RBP)",
            "Step-by-step setup of Recruiting, Goal, and Performance management modules",
            "Preparation for the SF EC global certificate exams",
            "Direct corporate referrals for HR IT roles"
        ],
        schedule: {
            weekday: "Monday - Friday (11:00 AM - 1:00 PM)",
            weekend: "Saturday & Sunday (2:00 PM - 6:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Cloud HCM Fundamentals & Instance Settings",
                topics: [
                    "Introduction to Cloud HR and SuccessFactors landscape",
                    "Navigation and Theme Manager configuration",
                    "Managing Admin Center & Action Search",
                    "Role-Based Permissions (RBP) groups and roles setup"
                ]
            },
            {
                moduleTitle: "Module 2: Employee Central (Core HR)",
                topics: [
                    "Data Models configuration (Corporate, Succession, Country-Specific)",
                    "Configuring Foundation Objects & Business Rules",
                    "Employee profile fields, employment details, and events",
                    "Workflows configuration and alerts setup"
                ]
            },
            {
                moduleTitle: "Module 3: Recruiting Management",
                topics: [
                    "Job Requisition templates and workflows",
                    "Candidate Profile & Application page designs",
                    "Configuring career portals and job posting configurations"
                ]
            },
            {
                moduleTitle: "Module 4: Performance & Goals Management",
                topics: [
                    "Creating Goal Plan templates and libraries",
                    "Performance Form templates and route maps configuration",
                    "Calibration sessions setup and 360-degree reviews"
                ]
            },
            {
                moduleTitle: "Module 5: Integration & Compensation",
                topics: [
                    "SuccessFactors Integration Center overview",
                    "Introduction to Compensation planning cycles",
                    "Reporting and Ad-Hoc schemas creation"
                ]
            }
        ]
    },
    "sap-basis": {
        id: "sap-basis",
        title: "SAP BASIS (System Administration)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "3 Months",
        format: "Classroom & Online",
        projects: "Multi-system Landscape setup",
        certification: "SAP BASIS Administrator Associate Prep",
        about: "SAP BASIS is the operating system and database administration layer for SAP applications. This technical course teaches you how to install SAP systems, manage database backups, transport customizations, setup users and roles, configure system monitoring, and ensure security policies.",
        details: {
            audience: "System Administrators, Database Administrators (DBA), Network Engineers, and IT Support Executives.",
            prerequisites: "Basic understanding of operating systems (Linux/Windows Server) and relational databases.",
            roles: "SAP BASIS Consultant, SAP System Administrator, NetWeaver Administrator.",
            salary: "₹5 LPA - ₹12 LPA"
        },
        benefits: [
            "Complete installation walkthrough of SAP NetWeaver AS ABAP",
            "Hands-on transport management system (TMS) configuration",
            "Configuring backups, system refreshes, and database health checks",
            "Practical exercises in client administration and role creation (PFCG)",
            "MNC-ready interview training and placement connections"
        ],
        schedule: {
            weekday: "Monday - Friday (4:00 PM - 6:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 2:00 PM)",
            nextBatch: "Third Monday of the month"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: SAP Architecture & Installation Fundamentals",
                topics: [
                    "Introduction to NetWeaver Application Server architecture",
                    "Process types (Work processes: Dialog, Batch, Update, Spool, Enqueue)",
                    "Pre-requisites and installation of SAP GUI and Application Server instance"
                ]
            },
            {
                moduleTitle: "Module 2: Client Administration",
                topics: [
                    "Concept of SAP Clients",
                    "Creating, copying, and deleting clients (Local, Remote, and Client Export/Import)",
                    "Client copy troubleshooting and log checks"
                ]
            },
            {
                moduleTitle: "Module 3: Transport Management System (TMS)",
                topics: [
                    "Configuring TMS landscape (Development, Quality, Production)",
                    "Creating Transport Requests (TRs) and customizing Tasks",
                    "Releasing TRs and importing them into target clients/systems"
                ]
            },
            {
                moduleTitle: "Module 4: User Administration & Security",
                topics: [
                    "Creating users and managing lock/unlock sessions (SU01)",
                    "Role administration using Profile Generator (PFCG)",
                    "Authorization objects and troubleshooting authorization failures (SU53)"
                ]
            },
            {
                moduleTitle: "Module 5: Database Administration & Monitoring",
                topics: [
                    "Introduction to SAP HANA Database administration",
                    "Backups, recovery procedures, and space checks",
                    "System performance monitoring (ST02, ST04, ST22, SM21)"
                ]
            }
        ]
    },
    "sap-hana": {
        id: "sap-hana",
        title: "SAP HANA (In-Memory Database & Modeling)",
        category: "SAP Specialization",
        icon: "bx-building-house",
        duration: "2.5 Months",
        format: "Classroom & Online",
        projects: "HANA Cloud Data Analytics",
        certification: "SAP HANA Technology Associate Exam Prep",
        about: "SAP HANA is the column-oriented in-memory database platform that powers modern SAP S/4HANA systems. This course covers the architecture of HANA, table partitioning, data loading using SDI/SDQ, model creation (Attribute, Analytic, Calculation views), and database administration tasks.",
        details: {
            audience: "Database Developers, Business Intelligence (BI) Analysts, ABAP Developers, and BASIS Consultants.",
            prerequisites: "Good understanding of standard SQL commands and relational database designs.",
            roles: "SAP HANA Developer, HANA DB Modeler, Database Consultant.",
            salary: "₹6 LPA - ₹14 LPA"
        },
        benefits: [
            "Access to SAP HANA Studio and Web IDE console environment",
            "Configuring real calculation views and advanced scripting",
            "Data replication scenarios using SLT and Smart Data Integration",
            "Practical tuning of query performance for massive datasets",
            "Mock tests for SAP HANA Certification"
        ],
        schedule: {
            weekday: "Monday - Friday (6:30 PM - 8:30 PM)",
            weekend: "Saturday & Sunday (12:00 PM - 4:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: SAP HANA Architecture & Storage",
                topics: [
                    "In-Memory Database concepts: Column vs Row storage",
                    "SAP HANA Memory structures (Index Server, Name Server, Preprocessor)",
                    "Multi-tenant Database Containers (MDC) architecture"
                ]
            },
            {
                moduleTitle: "Module 2: HANA Database Schema & Table Design",
                topics: [
                    "Creating Schemas, Tables, and Views using SQL Console",
                    "Table partitioning techniques (Hash, Range, Round-Robin, Multi-level)",
                    "Database constraints and indexing optimization"
                ]
            },
            {
                moduleTitle: "Module 3: Information Modeling & Views",
                topics: [
                    "Creating Attribute Views and Analytic Views (for legacy reference)",
                    "Building Calculation Views (Graphical & Scripted)",
                    "Implementing Joins, Projections, Unions, and Aggregations",
                    "Defining Input Parameters and Variables"
                ]
            },
            {
                moduleTitle: "Module 4: Advanced SQL Scripting & SQLScript",
                topics: [
                    "Introduction to SQLScript (procedures and table functions)",
                    "Writing stored procedures with parameters",
                    "Debugging procedures in HANA Studio/Web IDE"
                ]
            },
            {
                moduleTitle: "Module 5: Data Provisioning & Administration",
                topics: [
                    "Data replication using SAP Landscape Transformation (SLT)",
                    "Smart Data Integration (SDI) and Smart Data Quality (SDQ) basics",
                    "Backup/Recovery, user administration, and privileges"
                ]
            }
        ]
    },

    // ==========================================
    //  CLOUD & DEVOPS
    // ==========================================
    "aws-devops": {
        id: "aws-devops",
        title: "AWS Cloud & DevOps",
        category: "Cloud & DevOps",
        icon: "bxl-amazon",
        duration: "3 Months",
        format: "Classroom & Online",
        projects: "E2E Automated CI/CD Deployment",
        certification: "AWS SysOps & Certified DevOps Engineer Exam Prep",
        about: "This program blends cloud engineering on Amazon Web Services (AWS) with modern DevOps operations. You will learn compute, database, networking, and security services on AWS, alongside industry-standard DevOps tools like Git, Docker, Kubernetes, Jenkins pipelines, and Terraform infrastructure as code.",
        details: {
            audience: "IT Professionals, Developers, System Administrators, and Tech Graduates seeking high-growth cloud career tracks.",
            prerequisites: "Basic computer networking and standard operating system skills. Linux command basics (covered in initial bridge week).",
            roles: "DevOps Engineer, Cloud Architect, AWS Administrator, Site Reliability Engineer (SRE).",
            salary: "₹6 LPA - ₹15 LPA"
        },
        benefits: [
            "Practical, project-centric labs with individual AWS sandbox credits",
            "Setting up complex CI/CD pipelines (CodeCommit, CodeBuild, Jenkins)",
            "Containerization training with Docker and orchestration on Kubernetes (EKS)",
            "Infrastructure provisioning scripts using Terraform",
            "Extensive mock interview questions and direct client partner interviews"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM OR 7:00 PM - 9:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 3:00 PM)",
            nextBatch: "Every Monday"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: AWS Cloud Essentials (Compute, Network, Storage)",
                topics: [
                    "Introduction to Cloud Computing & AWS Global Infrastructure",
                    "Amazon EC2 instances, Autoscaling, and Load Balancers (ALB/NLB)",
                    "Networking: Amazon VPC (Subnets, Route Tables, NAT Gateways)",
                    "Storage: Simple Storage Service (S3), EBS volumes, EFS systems"
                ]
            },
            {
                moduleTitle: "Module 2: Databases, Security & IAM",
                topics: [
                    "Amazon RDS (MySQL/PostgreSQL) and DynamoDB NoSQL setup",
                    "AWS Identity and Access Management (IAM): Users, Roles, Policies",
                    "Monitoring: CloudWatch metrics, alarms, and CloudTrail audits"
                ]
            },
            {
                moduleTitle: "Module 3: Infrastructure as Code (IaC) & Config Management",
                topics: [
                    "Terraform: Syntax, State files, Resource provisioning, and Modules",
                    "AWS CloudFormation templates configuration",
                    "Ansible: Playbooks, Inventory management, and configuration runs"
                ]
            },
            {
                moduleTitle: "Module 4: Containerization & Orchestration",
                topics: [
                    "Docker: Dockerfiles, image creation, container networking, volumes",
                    "Kubernetes: Architecture, Pods, Deployments, Services, ConfigMaps",
                    "AWS EKS (Elastic Kubernetes Service) cluster administration"
                ]
            },
            {
                moduleTitle: "Module 5: Continuous Integration & Delivery (CI/CD)",
                topics: [
                    "Git workflow, branching strategies, and GitHub actions",
                    "Jenkins server administration, plugins, and Declarative Pipelines",
                    "AWS DevOps services: CodeCommit, CodeBuild, CodeDeploy, CodePipeline"
                ]
            }
        ]
    },
    "azure-cloud": {
        id: "azure-cloud",
        title: "Microsoft Azure Cloud",
        category: "Cloud & DevOps",
        icon: "bxl-microsoft",
        duration: "2.5 Months",
        format: "Classroom & Online",
        projects: "Azure Virtual Data Center",
        certification: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
        about: "Become a certified Azure Administrator. This course walks you through configuring Microsoft Azure virtual networks, managing virtual machines, administering storage options, configuring active directory accounts, and deploying serverless compute solutions.",
        details: {
            audience: "System Administrators, Technical Graduates, and IT Support engineers.",
            prerequisites: "Basic understanding of client-server systems and networking concepts.",
            roles: "Azure Administrator, Cloud Security Engineer, Azure Solutions Specialist.",
            salary: "₹5.5 LPA - ₹13 LPA"
        },
        benefits: [
            "Preparation for the AZ-104 Administrator exam with practice sets",
            "Configuring Virtual Network Peering, VPN Gateways, and ExpressRoute",
            "Azure Active Directory (Entra ID) configuration and access control",
            "Creating serverless environments using Azure Functions and Web Apps",
            "Job portal profile optimization and resume formatting assistance"
        ],
        schedule: {
            weekday: "Monday - Friday (10:30 AM - 12:30 PM)",
            weekend: "Saturday & Sunday (2:00 PM - 6:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Azure Compute & Storage Solutions",
                topics: [
                    "Azure Subscription, Resource Groups, and ARM Templates",
                    "Virtual Machines creation, sizing, scaling, and backups",
                    "Azure App Services & serverless Azure Functions",
                    "Storage accounts: Blob storage, File shares, lifecycle rules"
                ]
            },
            {
                moduleTitle: "Module 2: Azure Virtual Networks (Networking)",
                topics: [
                    "Virtual Networks (VNet) configuration, subnets, and routing",
                    "Network Security Groups (NSG) and Application Security Groups",
                    "VNet Peering, Azure Bastion, and VPN Gateway connections"
                ]
            },
            {
                moduleTitle: "Module 3: Identity, Governance & Access Control",
                topics: [
                    "Microsoft Entra ID (Azure Active Directory) user/group management",
                    "Role-Based Access Control (RBAC) and custom role policies",
                    "Azure Policies, Resource Locks, and Cost Management tools"
                ]
            },
            {
                moduleTitle: "Module 4: Databases & Load Balancers",
                topics: [
                    "Azure SQL databases and Azure Cosmos DB overview",
                    "Azure Load Balancer, Application Gateway, and Traffic Manager",
                    "Monitoring: Azure Monitor metrics, logs, and Log Analytics Workspaces"
                ]
            },
            {
                moduleTitle: "Module 5: Azure DevOps Introduction",
                topics: [
                    "Azure Boards, Repos, and Pipelines overview",
                    "Deploying web apps via automated Azure Pipelines",
                    "Azure Key Vault setup for secure secrets management"
                ]
            }
        ]
    },

    // ==========================================
    //  DATA SCIENCE & ENGINEERING
    // ==========================================
    "data-science": {
        id: "data-science",
        title: "Data Science & Machine Learning",
        category: "Data Science & Big Data",
        icon: "bx-math",
        duration: "3 Months",
        format: "Classroom & Online",
        projects: "Predictive Analytics Business Case",
        certification: "Certified Data Science Professional Prep",
        about: "Launch your career in the world of statistics and data modeling. Learn Python libraries (NumPy, Pandas, Matplotlib, Seaborn), statistical significance, exploratory data analysis (EDA), and machine learning models (Regression, Decision Trees, Random Forest, Clustering).",
        details: {
            audience: "BSc Maths/Stats Graduates, MCA, B.E./B.Tech Students, Business Analysts, and technical professionals.",
            prerequisites: "Basic knowledge of school-level algebra and statistics. Python scripting basics (taught as a prerequisite module).",
            roles: "Data Scientist, Machine Learning Engineer, Data Analyst, Business Intelligence Analyst.",
            salary: "₹6 LPA - ₹14 LPA"
        },
        benefits: [
            "Practical programming with Jupyter Notebooks & VS Code",
            "Working on real datasets from Kaggle and corporate partners",
            "1-on-1 portfolio review of your GitHub repository",
            "Mock technical rounds covering statistics, algorithms, and SQL",
            "100% placement assurance with leading analytics firms"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM OR 6:00 PM - 8:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 3:00 PM)",
            nextBatch: "Every Monday"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Python programming & Data Analysis Libraries",
                topics: [
                    "Python programming basics: Loops, Lists, Dicts, Functions",
                    "NumPy: Multidimensional Arrays, indexing, linear algebra basics",
                    "Pandas: DataFrames, cleaning data, handling missing values, joining tables",
                    "Visualization: Matplotlib and Seaborn plotting"
                ]
            },
            {
                moduleTitle: "Module 2: Statistics & Exploratory Data Analysis (EDA)",
                topics: [
                    "Descriptive statistics: Mean, Median, Mode, Variance, SD",
                    "Probability distributions, Central Limit Theorem, Hypothesis testing",
                    "Feature Engineering, encoding categorical data, and normalization"
                ]
            },
            {
                moduleTitle: "Module 3: Supervised Machine Learning Algorithms",
                topics: [
                    "Linear Regression and Logistic Regression",
                    "Decision Trees, Gini index, Entropy, and Random Forest Classifier",
                    "Support Vector Machines (SVM) and K-Nearest Neighbors (KNN)",
                    "Evaluation metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC"
                ]
            },
            {
                moduleTitle: "Module 4: Unsupervised Learning & Dimensionality Reduction",
                topics: [
                    "K-Means Clustering and Hierarchical Clustering",
                    "Principal Component Analysis (PCA) for dimensionality reduction",
                    "Anomaly detection techniques"
                ]
            },
            {
                moduleTitle: "Module 5: Database Querying & Deployment",
                topics: [
                    "Relational databases: SQL queries (Select, Join, Group By, Subqueries)",
                    "Introduction to model deployment using Streamlit and Flask APIs"
                ]
            }
        ]
    },
    "data-science-ai": {
        id: "data-science-ai",
        title: "Data Science with Artificial Intelligence",
        category: "Data Science & Big Data",
        icon: "bx-network-chart",
        duration: "3 Months",
        format: "Classroom & Online",
        projects: "Deep Learning NLP & CV Systems",
        certification: "Applied AI Specialist Prep",
        about: "This program elevates standard Data Science by integrating Deep Learning and Cognitive AI models. You will cover Artificial Neural Networks (ANN), Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN/LSTM), PyTorch, Computer Vision pipelines, and Natural Language Processing algorithms.",
        details: {
            audience: "Developers, Data Analysts, Data Science students, and Tech Engineers wanting to build advanced AI systems.",
            prerequisites: "Good foundation in Python programming and basic machine learning concepts.",
            roles: "AI Engineer, Deep Learning Specialist, CV Researcher, NLP Developer.",
            salary: "₹7 LPA - ₹18 LPA"
        },
        benefits: [
            "Building deep learning models using TensorFlow / PyTorch",
            "GPU-powered cloud workspace access for model training",
            "Real-world image classification and text summarization projects",
            "Guidance from working AI practitioners and researchers",
            "Direct corporate interview scheduling for senior roles"
        ],
        schedule: {
            weekday: "Monday - Friday (1:00 PM - 3:00 PM)",
            weekend: "Saturday & Sunday (11:00 AM - 3:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Deep Learning Fundamentals (Neural Networks)",
                topics: [
                    "Introduction to Artificial Neural Networks (ANN)",
                    "Perceptron, Activation Functions (ReLU, Sigmoid, Softmax)",
                    "Backpropagation algorithm, Loss functions, and Optimizers (Adam, SGD)",
                    "Building deep neural nets with PyTorch/TensorFlow"
                ]
            },
            {
                moduleTitle: "Module 2: Computer Vision (CNNs)",
                topics: [
                    "Convolutional Neural Networks (CNN) architecture",
                    "Image preprocessing, filters, pooling layers, and strides",
                    "Image classification, object detection (YOLO basics), and Transfer Learning (ResNet)"
                ]
            },
            {
                moduleTitle: "Module 3: Natural Language Processing & Sequential Models",
                topics: [
                    "Text preprocessing, tokenization, word embeddings (Word2Vec, GloVe)",
                    "Recurrent Neural Networks (RNN) and LSTMs for sequential data",
                    "Sequence-to-sequence models and Attention mechanism basics"
                ]
            },
            {
                moduleTitle: "Module 4: Transformer Models & LLM Integration",
                topics: [
                    "Introduction to Transformer Architecture (Self-Attention)",
                    "Working with HuggingFace library, text generation, sentiment tasks",
                    "Integrating Pre-trained Large Language Models (LLMs) via APIs"
                ]
            },
            {
                moduleTitle: "Module 5: Model Optimization & MLOps",
                topics: [
                    "Model saving formats, quantization, and pruning",
                    "Deploying Deep Learning models via Docker containers onto AWS/GCP"
                ]
            }
        ]
    },
    "data-analytics": {
        id: "data-analytics",
        title: "Data Analytics & Business Intelligence",
        category: "Data Science & Big Data",
        icon: "bx-bar-chart-square",
        duration: "2.5 Months",
        format: "Classroom & Online",
        projects: "Corporate Executive Dashboard",
        certification: "Power BI Data Analyst Associate Prep (PL-300)",
        about: "Master data retrieval and interactive dashboarding. This curriculum covers advanced Excel business functions, writing database queries in SQL, designing automated data structures, and building stunning interactive reports in Microsoft Power BI and Tableau.",
        details: {
            audience: "Non-technical students, Commerce/Arts graduates, Business Analysts, and sales/ops professionals.",
            prerequisites: "Basic computer operations. No prior technical or programming experience needed.",
            roles: "Data Analyst, BI Consultant, Business Reporting Analyst, Operations Analyst.",
            salary: "₹4 LPA - ₹9 LPA"
        },
        benefits: [
            "Creating end-to-end interactive dashboard projects for portfolio",
            "Strong focus on relational database design and writing SQL queries",
            "Preparing for Microsoft PL-300 certification exam",
            "1-on-1 resume building with recruiters",
            "Regular job updates and placement support"
        ],
        schedule: {
            weekday: "Monday - Friday (10:00 AM - 12:00 PM)",
            weekend: "Saturday & Sunday (3:00 PM - 7:00 PM)",
            nextBatch: "First Monday of the month"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Advanced Business Excel",
                topics: [
                    "VLOOKUP, HLOOKUP, INDEX-MATCH functions",
                    "Pivot Tables, Pivot Charts, and Slicers",
                    "Data cleansing, Power Query editor in Excel, and logical conditions"
                ]
            },
            {
                moduleTitle: "Module 2: SQL Database Operations",
                topics: [
                    "Introduction to databases (MySQL / PostgreSQL)",
                    "Select queries, filtering (Where, Like), and sorting",
                    "SQL joins (Inner, Left, Right, Full), Group By and Aggregation",
                    "Subqueries, Common Table Expressions (CTEs), and window functions"
                ]
            },
            {
                moduleTitle: "Module 3: Power BI - Data Integration & DAX",
                topics: [
                    "Connecting data sources and ETL processes using Power Query",
                    "Data Modeling: Star Schema, Snowflake Schema, Relationships",
                    "DAX (Data Analysis Expressions): Calculated columns, Measures, Time Intelligence functions"
                ]
            },
            {
                moduleTitle: "Module 4: Power BI - Visualizations & Reports",
                topics: [
                    "Creating charts, maps, cards, matrices, and custom visuals",
                    "Interactivity: Filters, Tooltips, bookmarks, drill-down settings",
                    "Publishing to Power BI Service, workspaces, and gateway refresh scheduler"
                ]
            },
            {
                moduleTitle: "Module 5: Tableau BI Analytics",
                topics: [
                    "Tableau workspace layout and connection files",
                    "Creating sheets: bar, line, dual axis, scatter plots",
                    "Designing dashboards, stories, and sharing configurations"
                ]
            }
        ]
    },
    "databricks": {
        id: "databricks",
        title: "Databricks & Delta Lake",
        category: "Data Science & Big Data",
        icon: "bx-cube",
        duration: "2 Months",
        format: "Classroom & Online",
        projects: "Lakehouse Pipeline Automation",
        certification: "Databricks Certified Associate Developer / Data Engineer Associate",
        about: "Databricks is the premier unified cloud-based analytics platform. Learn how to configure Databricks workspaces, read/write to Delta Lake tables, run collaborative notebooks, orchestrate data jobs, and manage database security features on AWS/Azure.",
        details: {
            audience: "Data Engineers, Database Admins, Cloud Engineers, and Data Analysts looking to upgrade to Lakehouse architectures.",
            prerequisites: "Good python coding ability and familiarity with SQL query syntax.",
            roles: "Databricks Engineer, Cloud Data Architect, Big Data Developer.",
            salary: "₹7.5 LPA - ₹17 LPA"
        },
        benefits: [
            "Practicing on Databricks Community Edition and Enterprise clouds",
            "Building robust Medallion Architecture pipelines (Bronze, Silver, Gold)",
            "Step-by-step preparation for Databricks Certification",
            "Code optimization reviews and query speed tuning strategies",
            "MNC direct partner hiring pipelines"
        ],
        schedule: {
            weekday: "Monday - Friday (6:30 PM - 8:30 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 2:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Databricks Architecture & Workspace",
                topics: [
                    "Lakehouse concept: Combining Data Lakes and Warehouses",
                    "Setting up Databricks accounts, clusters, and runtimes",
                    "Collaborative notebooks, import/export formats, and markdown usage"
                ]
            },
            {
                moduleTitle: "Module 2: Delta Lake Storage technology",
                topics: [
                    "ACID transactions on data lakes, parquet format evolution",
                    "Creating, writing, and updating Delta tables (SQL / Python API)",
                    "Delta features: Time Travel (Version history), Optimization (Z-order, File compaction)"
                ]
            },
            {
                moduleTitle: "Module 3: Medallion Data Pipelines",
                topics: [
                    "Bronze layer (Raw ingestion, file schemas)",
                    "Silver layer (Data cleaning, joining lookup tables, validation rules)",
                    "Gold layer (Business metrics, aggregations, reporting tables)"
                ]
            },
            {
                moduleTitle: "Module 4: Databricks SQL & Dashboards",
                topics: [
                    "Databricks SQL warehouse configuration",
                    "Writing SQL queries on lakehouse objects",
                    "Creating rapid query dashboards and alert rules"
                ]
            },
            {
                moduleTitle: "Module 5: Orchestration & Security",
                topics: [
                    "Job scheduling and workflows management",
                    "Access control list (ACL) management on tables and compute"
                ]
            }
        ]
    },
    "pyspark": {
        id: "pyspark",
        title: "PySpark Big Data Engineering",
        category: "Data Science & Big Data",
        icon: "bx-shuffle",
        duration: "2 Months",
        format: "Classroom & Online",
        projects: "Tera-scale Processing Pipeline",
        certification: "Apache Spark Developer Prep",
        about: "Master Apache Spark computing engine using Python. This program covers Resilient Distributed Datasets (RDDs), Spark DataFrames, lazy evaluation patterns, data transformations, windowing functions, Spark SQL optimizations, and streaming data concepts.",
        details: {
            audience: "Software Engineers, Database Developers, and Data Analysts moving into Big Data roles.",
            prerequisites: "Good foundation in Python programming and basic SQL database constructs.",
            roles: "PySpark Developer, Big Data Engineer, ETL Developer.",
            salary: "₹7 LPA - ₹16 LPA"
        },
        benefits: [
            "Writing and optimization scripts for gigabyte to terabyte-scale datasets",
            "Techniques to eliminate partition skew and shuffle overheads",
            "Working with Spark SQL and integrating with external databases",
            "Live project reviews by senior Big Data Architects",
            "CV optimization for top tier multinational analytics companies"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM)",
            weekend: "Saturday & Sunday (1:00 PM - 5:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Spark Framework Basics",
                topics: [
                    "Big Data challenges & introduction to Distributed Computing",
                    "Apache Spark Architecture: Driver, Executer, SparkContext, SparkSession",
                    "Lazy evaluation, Directed Acyclic Graph (DAG), actions and transformations"
                ]
            },
            {
                moduleTitle: "Module 2: PySpark DataFrames API",
                topics: [
                    "Creating DataFrames from CSV, JSON, Parquet files",
                    "Selecting, filtering, ordering, renaming columns",
                    "Handling Null values, User Defined Functions (UDFs) optimization"
                ]
            },
            {
                moduleTitle: "Module 3: Aggregations & Joins",
                topics: [
                    "GroupBy, agg, and pivoting functions",
                    "Distributed Joins: Broadcast joins vs Shuffle Hash joins",
                    "Window functions (ranking, lead/lag, rolling averages)"
                ]
            },
            {
                moduleTitle: "Module 4: Performance Tuning & Optimization",
                topics: [
                    "Managing Partitions (coalesce vs repartition)",
                    "Caching and Persisting data (Memory, Disk storage options)",
                    "Inspecting Spark UI for Bottlenecks, Spills, and Skews"
                ]
            },
            {
                moduleTitle: "Module 5: Spark SQL & Ingestion",
                topics: [
                    "Registering Temp Views & writing SQL syntax",
                    "Reading/writing from/to PostgreSQL, MySQL, and HDFS"
                ]
            }
        ]
    },

    // ==========================================
    //  AI ENGINEERING & FINANCE
    // ==========================================
    "agentic-ai": {
        id: "agentic-ai",
        title: "Agentic AI Developer Program",
        category: "AI Engineering & Finance",
        icon: "bx-bot",
        duration: "2 Months",
        format: "Classroom & Online",
        projects: "Multi-Agent System for Market Analysis",
        certification: "Applied Agentic AI Specialist Certification Prep",
        about: "Go beyond chat interfaces. Learn to build intelligent autonomous AI agents capable of reasoning, planning, tool usage, and collaborating. This path covers Agent design patterns, CrewAI, AutoGen frameworks, Task delegation, tool integrations, and agent evaluation.",
        details: {
            audience: "Software Engineers, Python Developers, and AI Enthusiasts wanting to build production-grade agent systems.",
            prerequisites: "Strong python coding knowledge and basic familiarity with LangChain or OpenAI APIs.",
            roles: "AI Agent Architect, Cognitive Engineer, Generative AI Solution Developer.",
            salary: "₹8 LPA - ₹20 LPA"
        },
        benefits: [
            "Building production-grade multi-agent crews with specialized roles",
            "Configuring agents to use web scrapers, database connections, and custom toolkits",
            "Training in managing LLM token consumption and rate limiting",
            "Access to private community of AI founders and developers",
            "Placement references with high-tech software houses"
        ],
        schedule: {
            weekday: "Monday - Friday (7:00 PM - 9:00 PM)",
            weekend: "Saturday & Sunday (10:00 AM - 2:00 PM)",
            nextBatch: "Alternate Mondays"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Agentic Architecture & Concepts",
                topics: [
                    "What is Agentic AI? Single Agent vs Multi-Agent Systems",
                    "ReAct Pattern: Reasoning and Action loop",
                    "State management and memory patterns (short-term, long-term, semantic)"
                ]
            },
            {
                moduleTitle: "Module 2: Building Multi-Agent Systems with CrewAI",
                topics: [
                    "Defining Agents: Roles, Backstories, Goals",
                    "Structuring Tasks, setting dependencies, execution flows (sequential, hierarchical)",
                    "Equipping agents with default and custom tools (Google Search, SQL database, local file writers)"
                ]
            },
            {
                moduleTitle: "Module 3: Advanced Conversations with Microsoft AutoGen",
                topics: [
                    "Conversational Agent patterns: User Proxy, Assistant Agent",
                    "Group Chat Managers, dynamic conversation routers",
                    "Equipping AutoGen agents with local Python execution sandboxes"
                ]
            },
            {
                moduleTitle: "Module 4: Agent Tools, Function Calling & APIs",
                topics: [
                    "Writing custom tools, schema declarations, and type hints",
                    "OpenAI and Anthropic Function Calling API details",
                    "Handling edge cases: Tool output errors, infinite loops, format recovery"
                ]
            },
            {
                moduleTitle: "Module 5: Evaluation & MLOps for Agents",
                topics: [
                    "Testing agent workflows, cost monitoring, and LangSmith debugging",
                    "Deploying agent fleets using FastAPI, docker containers, and serverless backends"
                ]
            }
        ]
    },
    "generative-ai": {
        id: "generative-ai",
        title: "Advanced Generative AI",
        category: "AI Engineering & Finance",
        icon: "bx-slideshow",
        duration: "2 Months",
        format: "Classroom & Online",
        projects: "Enterprise Knowledge Base (RAG) System",
        certification: "Applied Generative AI Expert",
        about: "Master the state of the art in Generative AI. This course covers Prompt Engineering patterns, Retrieval Augmented Generation (RAG), vector databases (ChromaDB, Pinecone), LangChain and LlamaIndex frameworks, API orchestrations, and parameter-efficient fine-tuning (PEFT/LoRA) of open-source models like Llama-3.",
        details: {
            audience: "Developers, IT Professionals, and Data Engineers seeking to implement LLM technologies in corporate databases.",
            prerequisites: "Good python programming foundation. Experience with APIs is helpful.",
            roles: "Generative AI Engineer, LLM Developer, NLP Solution Specialist.",
            salary: "₹7.5 LPA - ₹18 LPA"
        },
        benefits: [
            "Building custom semantic search engines on enterprise PDF knowledge bases",
            "Hands-on quantization and fine-tuning on Google Colab/Kaggle GPUs",
            "Learning techniques to mitigate LLM hallucinations",
            "Mock technical rounds addressing architecture design of Generative systems",
            "Direct corporate network intros for AI consulting roles"
        ],
        schedule: {
            weekday: "Monday - Friday (8:00 AM - 10:00 AM)",
            weekend: "Saturday & Sunday (1:00 PM - 5:00 PM)",
            nextBatch: "Every Monday"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: LLM APIs & Advanced Prompting",
                topics: [
                    "OpenAI, Anthropic, Gemini, and Local (Ollama) API setup",
                    "Prompt Patterns: Few-shot, Chain-of-thought, Self-consistency",
                    "Structured outputs: JSON schema generation and validation libraries"
                ]
            },
            {
                moduleTitle: "Module 2: LangChain & LlamaIndex Orchestration",
                topics: [
                    "Chains, Router chains, and custom prompt templates",
                    "Memory management: Conversational Buffer, Summary Memory",
                    "LlamaIndex Document Ingestion, Nodes, and Index Engines"
                ]
            },
            {
                moduleTitle: "Module 3: Retrieval Augmented Generation (RAG) & Vectors",
                topics: [
                    "Chunking strategies: Recursive character, semantic chunking",
                    "Embedding models, Cosine similarity, Euclidean distance metrics",
                    "Vector Databases: ChromaDB, Pinecone, Milvus setup and queries",
                    "Advanced RAG: Query translation, reranking, hybrid search (Sparse + Dense)"
                ]
            },
            {
                moduleTitle: "Module 4: Open Source LLMs & Fine-Tuning",
                topics: [
                    "Running HuggingFace models locally (Llama, Mistral, Gemma)",
                    "Model quantization: GGUF, AWQ, GPTQ formats",
                    "Parameter Efficient Fine-Tuning (PEFT): LoRA, QLoRA, dataset preparation, training run"
                ]
            },
            {
                moduleTitle: "Module 5: Security, Guardrails & Deployment",
                topics: [
                    "LLM security: Prompt Injection prevention, toxicity filtering",
                    "Guardrails setup (NeMo Guardrails, Llama Guard)",
                    "Deploying LLM apps using vLLM, Streamlit, and cloud containers"
                ]
            }
        ]
    },
    "financial-analyst": {
        id: "financial-analyst",
        title: "Financial Analyst Program",
        category: "AI Engineering & Finance",
        icon: "bx-money",
        duration: "3 Months",
        format: "Classroom & Online",
        projects: "Valuation & Financial Model of Listed Company",
        certification: "Certified Financial Modeling & Valuation Analyst Prep",
        about: "Kickstart your finance career in investment banking and corporate finance. This program covers excel modeling, financial statements projection, ratio analysis, Discounted Cash Flow (DCF) valuation, Comparable Company Analysis (CCA), Merger models, and presentation pitch books.",
        details: {
            audience: "Commerce Graduates, MBA Finance students, CA candidates, and professionals transitioning to financial roles.",
            prerequisites: "Basic interest in corporate business models. Accounting knowledge is helpful, but covered from scratch.",
            roles: "Financial Analyst, Equity Research Associate, Investment Banking Analyst, Corporate Finance Executive.",
            salary: "₹5 LPA - ₹11 LPA"
        },
        benefits: [
            "Building detailed financial projection spreadsheets of real companies from scratch",
            "Techniques in valuation models (DCF, multiples, LBO basics)",
            "Industry-experienced trainers (Chartered Accountants / CFA Charterholders)",
            "Step-by-step guidance in compiling equity research reports",
            "MNC financial services interview preparation and placement assistance"
        ],
        schedule: {
            weekday: "Monday - Friday (10:00 AM - 12:00 PM)",
            weekend: "Saturday & Sunday (9:00 AM - 1:00 PM)",
            nextBatch: "First Monday of the month"
        },
        syllabus: [
            {
                moduleTitle: "Module 1: Excel for Financial Modeling",
                topics: [
                    "Financial formula combinations (INDEX, MATCH, OFFSET, XLOOKUP)",
                    "Creating dynamic charts, dashboards, data tables, and sensitivity layouts",
                    "Excel keyboard shortcuts and structure best practices"
                ]
            },
            {
                moduleTitle: "Module 2: Financial Statement Analysis",
                topics: [
                    "Deep dive into Income Statement, Balance Sheet, Cash Flow Statement",
                    "Interlinking the 3 financial statements in Excel",
                    "Historical analysis: Horizontal, vertical, and profitability/liquidity ratios"
                ]
            },
            {
                moduleTitle: "Module 3: Forecasting & Projections",
                topics: [
                    "Revenue forecasting methods (unit-based, growth models)",
                    "Cost structures forecasting, working capital projections",
                    "Depreciation schedules, debt schedules, and tax forecasting"
                ]
            },
            {
                moduleTitle: "Module 4: Valuation Methodologies",
                topics: [
                    "Discounted Cash Flow (DCF) modeling: Free Cash Flow (FCFF/FCFE), WACC, Terminal Value",
                    "Relative Valuation: Comparable Company Analysis (Trading multiples: EV/EBITDA, P/E)",
                    "Precedent Transaction analysis"
                ]
            },
            {
                moduleTitle: "Module 5: Investment Pitch Books & M&A Basics",
                topics: [
                    "Designing equity research presentation slides",
                    "Accretion/Dilution analysis overview",
                    "Preparation for core finance interview panels"
                ]
            }
        ]
    }
};

module.exports = coursesData;
