"use strict";

const APP_VERSION = "2026.06.18";
const DB_NAME = "cissp-cram-local";
const STORE_NAME = "kv";
const STATE_KEY = "state";
const MS_DAY = 24 * 60 * 60 * 1000;
const DOMAIN_GATE_PASS_RATE = 0.9;

const navItems = [
  ["dashboard", "D", "Dashboard"],
  ["plan", "P", "Study Plan"],
  ["domains", "O", "Domains"],
  ["practice", "Q", "Practice"],
  ["flashcards", "F", "Flashcards"],
  ["errors", "E", "Error Notebook"],
  ["ask", "A", "Ask CISSP"],
  ["progress", "R", "Progress"],
  ["settings", "S", "Settings"]
];

const sourceRefs = [
  {
    id: "isc2-outline",
    title: "ISC2 CISSP Certification Exam Outline",
    detail: "Official domain weights and objectives, effective April 15, 2024.",
    url: "https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline"
  },
  {
    id: "official-guide",
    title: "ISC2 CISSP Official Study Guide",
    detail: "Local EPUB reference for curriculum coverage and objective mapping."
  },
  {
    id: "dummies",
    title: "CISSP For Dummies, 8th Edition",
    detail: "Local EPUB reference for simpler explanations and beginner-friendly framing."
  },
  {
    id: "practice-tests",
    title: "ISC2 CISSP Official Practice Tests",
    detail: "Local EPUB reference for tested concept patterns. Questions in this app are original."
  },
  {
    id: "prep-500",
    title: "CISSP Exam Prep 500+ Practice Questions",
    detail: "Local EPUB reference for supplemental style coverage. Questions in this app are original."
  }
];

const domains = [
  {
    id: "d1",
    number: 1,
    name: "Security and Risk Management",
    weight: 16,
    objectiveSummary: "Ethics, governance, risk, compliance, BCP, personnel security, threat modeling, SCRM, awareness.",
    objectives: [
      "1.1 Ethics and professional conduct",
      "1.2 Security concepts and principles",
      "1.3 Governance principles",
      "1.4 Legal, regulatory, privacy and compliance",
      "1.7 Business continuity requirements",
      "1.9 Risk management concepts",
      "1.10 Threat modeling",
      "1.11 Supply chain risk management",
      "1.12 Security awareness"
    ],
    concepts: [
      {
        id: "risk-treatment",
        title: "Risk Treatment",
        objective: "1.9",
        quick: "Risk treatment is the management decision to mitigate, transfer, avoid, or accept risk.",
        simple: "Do not jump to buying a tool. First understand the business impact, compare treatment options, and choose the response leadership can justify.",
        technical: "A risk assessment identifies assets, threats, vulnerabilities, likelihood, and impact. Treatment then applies safeguards, insurance, process change, avoidance, or explicit acceptance with accountable ownership and residual-risk tracking.",
        why: "CISSP questions reward business-aligned decisions, not reflexive technical fixes.",
        example: "A payment platform has a legacy dependency. Management may mitigate with compensating controls, transfer part of the loss through insurance, or accept residual risk during a planned migration.",
        manager: "Owns risk appetite, funding, policy, and acceptance of residual risk.",
        engineer: "Implements selected controls and reports whether they reduce likelihood or impact.",
        trap: "Choosing the strongest control without considering cost, mission impact, or risk appetite.",
        related: ["BIA", "Due care", "Residual risk", "Control types"],
        hook: "Treat risk like a business decision: reduce, share, stop, or sign.",
        check: "Who should formally accept residual risk after controls are applied?",
        comparisons: [
          ["Mitigate", "Reduce likelihood or impact with controls."],
          ["Transfer", "Shift financial impact through insurance or contract terms."],
          ["Avoid", "Stop the risky activity."],
          ["Accept", "Document and approve residual risk."]
        ]
      },
      {
        id: "due-care-diligence",
        title: "Due Care and Due Diligence",
        objective: "1.3",
        quick: "Due care is doing what a reasonable organization should do; due diligence is the investigation that informs it.",
        simple: "Diligence is looking carefully. Care is acting responsibly on what you found.",
        technical: "Due diligence includes assessments, audits, vendor review, legal review, and risk analysis. Due care includes policies, controls, training, monitoring, and response that demonstrate responsible security governance.",
        why: "Many governance questions test whether you can distinguish research from action.",
        example: "Reviewing an Okta tenant configuration before acquisition is diligence. Requiring MFA and conditional access after the review is care.",
        manager: "Ensures the organization has a repeatable governance program and evidence of reasonable behavior.",
        engineer: "Collects technical evidence and implements control improvements.",
        trap: "Treating a one-time assessment as proof that the organization is acting responsibly.",
        related: ["Governance", "Audit evidence", "Policy", "Risk acceptance"],
        hook: "Diligence discovers. Care does.",
        check: "Is a third-party security questionnaire due care or due diligence?",
        comparisons: [
          ["Due diligence", "Investigate before deciding."],
          ["Due care", "Act responsibly after deciding."]
        ]
      },
      {
        id: "business-continuity",
        title: "Business Continuity Requirements",
        objective: "1.7",
        quick: "Business continuity keeps essential business functions operating during disruption.",
        simple: "Start with the business impact, not the backup product. What must keep running, how fast, and at what loss tolerance?",
        technical: "A BIA identifies critical processes, dependencies, MTD, RTO, RPO, and recovery priorities. Continuity planning coordinates people, facilities, suppliers, technology recovery, communications, and exercises.",
        why: "CISSP expects security leaders to protect mission resilience, not just systems.",
        example: "A hospital prioritizes patient registration and medication systems before internal reporting tools because care delivery drives recovery order.",
        manager: "Sets priorities, approves recovery objectives, coordinates business owners, and tests the program.",
        engineer: "Builds resilient systems, backup processes, failover plans, and recovery runbooks.",
        trap: "Starting with disaster recovery technology before completing the BIA.",
        related: ["BIA", "RTO", "RPO", "MTD", "DRP"],
        hook: "BIA before backup.",
        check: "Which document identifies maximum tolerable downtime for a business process?",
        comparisons: [
          ["BCP", "Keeps business functions operating."],
          ["DRP", "Restores technology after disruption."],
          ["Incident response", "Contains and coordinates a security event."]
        ]
      }
    ]
  },
  {
    id: "d2",
    number: 2,
    name: "Asset Security",
    weight: 10,
    objectiveSummary: "Data classification, ownership, privacy, retention, handling, lifecycle and protection.",
    objectives: [
      "2.1 Information and asset classification",
      "2.2 Information and asset ownership",
      "2.3 Privacy protection",
      "2.4 Data retention",
      "2.5 Data security controls",
      "2.6 Data states"
    ],
    concepts: [
      {
        id: "data-classification",
        title: "Data Classification",
        objective: "2.1",
        quick: "Classification labels data so handling, access, retention, and protection match business sensitivity.",
        simple: "You cannot protect everything the same way. Label data by impact if it is exposed, changed, or lost.",
        technical: "Classification schemes define categories such as public, internal, confidential, and restricted. Owners approve labels, custodians apply controls, and users follow handling rules across data at rest, in transit, and in use.",
        why: "CISSP often asks for the first step in data protection: know what the data is and who owns it.",
        example: "Customer tax identifiers in a CRM receive stronger encryption, access review, and retention controls than public marketing copy.",
        manager: "Defines classification policy and assigns ownership.",
        engineer: "Implements labels, DLP, encryption, access controls, and monitoring.",
        trap: "Letting IT classify data without business owner accountability.",
        related: ["Data owner", "Custodian", "DLP", "Retention"],
        hook: "Label first, lock second.",
        check: "Who is accountable for approving a data classification?",
        comparisons: [
          ["Owner", "Accountable for classification and access decisions."],
          ["Custodian", "Implements and operates protection."],
          ["User", "Follows handling rules."]
        ]
      },
      {
        id: "data-lifecycle",
        title: "Data Lifecycle",
        objective: "2.4",
        quick: "The data lifecycle manages data from creation through use, sharing, retention, archive, and destruction.",
        simple: "Data protection is not only storage security. It changes as data moves, ages, and stops being useful.",
        technical: "Lifecycle controls cover collection limitation, classification, access, encryption, retention schedules, legal holds, archiving, sanitization, and destruction with evidence.",
        why: "The exam tests privacy and retention judgment, especially keeping data no longer than needed.",
        example: "An HR system stores candidate background checks for the approved retention period, then securely deletes them unless a legal hold applies.",
        manager: "Approves retention requirements and balances business, legal, and privacy needs.",
        engineer: "Automates retention labels, archival, deletion workflows, and destruction logs.",
        trap: "Keeping all data forever because storage is cheap.",
        related: ["Privacy", "Legal hold", "Sanitization", "Data minimization"],
        hook: "Collect less, keep only as long as justified, destroy with proof.",
        check: "What should happen before deleting records under investigation?",
        comparisons: [
          ["Archive", "Move inactive data under controlled retention."],
          ["Delete", "Remove logical access to data."],
          ["Destroy", "Render recovery infeasible and document evidence."]
        ]
      },
      {
        id: "privacy-by-design",
        title: "Privacy by Design",
        objective: "2.3",
        quick: "Privacy by design builds privacy principles into systems and processes before data is collected.",
        simple: "Do not bolt privacy on after launch. Ask what personal data is needed, why, who gets it, and how people can exercise rights.",
        technical: "Privacy design uses minimization, purpose limitation, consent or lawful basis, transparency, access controls, pseudonymization, encryption, retention limits, and privacy impact assessments.",
        why: "CISSP expects privacy to be a governance and architecture concern, not just a legal notice.",
        example: "A learning app stores exam progress locally by default instead of sending personal study data to a cloud database.",
        manager: "Sets privacy requirements and ensures regulatory accountability.",
        engineer: "Implements minimization, secure defaults, access logging, and deletion paths.",
        trap: "Assuming encryption alone satisfies privacy obligations.",
        related: ["PII", "DPIA", "Data minimization", "Purpose limitation"],
        hook: "Need it, say it, protect it, delete it.",
        check: "Which privacy principle argues against collecting optional demographic data?"
      }
    ]
  },
  {
    id: "d3",
    number: 3,
    name: "Security Architecture and Engineering",
    weight: 13,
    objectiveSummary: "Secure design principles, models, cryptography, physical security, architecture, engineering and vulnerabilities.",
    objectives: [
      "3.1 Secure design principles",
      "3.2 Security models",
      "3.3 Controls by information system type",
      "3.5 Cryptography",
      "3.6 Physical security",
      "3.7 Site and facility design"
    ],
    concepts: [
      {
        id: "secure-design",
        title: "Secure Design Principles",
        objective: "3.1",
        quick: "Secure design principles reduce risk by shaping systems around least privilege, defense in depth, secure defaults, and fail-safe behavior.",
        simple: "Build the system so the safe path is the default path and a single mistake is not catastrophic.",
        technical: "Principles include least privilege, separation of duties, complete mediation, economy of mechanism, open design, fail secure, defense in depth, zero trust, and secure defaults.",
        why: "CISSP architecture questions often ask for the design principle, not the specific vendor control.",
        example: "An admin workflow requires privileged access management, approval, just-in-time elevation, session recording, and separate break-glass controls.",
        manager: "Requires architecture standards and accepts tradeoffs.",
        engineer: "Implements controls in identity, network, application, and infrastructure layers.",
        trap: "Calling one control defense in depth when it protects only one layer.",
        related: ["Least privilege", "Fail secure", "Complete mediation", "Zero trust"],
        hook: "Safe by default, checked every time, limited by role.",
        check: "Which design principle requires every access request to be evaluated?"
      },
      {
        id: "crypto-use",
        title: "Cryptography Use",
        objective: "3.5",
        quick: "Cryptography protects confidentiality, integrity, authentication, and nonrepudiation when selected and managed correctly.",
        simple: "Encryption is powerful, but key management is the real system. Bad keys make good algorithms useless.",
        technical: "Symmetric crypto is fast for bulk data. Asymmetric crypto supports key exchange, digital signatures, and PKI. Hashes provide integrity, while HMAC adds keyed authenticity. Certificates bind public keys to identities.",
        why: "The exam asks what security property a mechanism provides and where key management can fail.",
        example: "TLS uses certificates and asymmetric methods to authenticate and establish secrets, then symmetric encryption for efficient session protection.",
        manager: "Approves standards, lifecycle, key ownership, escrow needs, and compliance posture.",
        engineer: "Implements approved algorithms, certificate rotation, HSM use, and secure protocol configuration.",
        trap: "Using encryption where hashing or digital signatures are the real requirement.",
        related: ["PKI", "HMAC", "Digital signature", "Key escrow"],
        hook: "Encrypt for secrecy, hash for integrity, sign for proof.",
        check: "Which mechanism provides nonrepudiation for a document?"
      },
      {
        id: "security-models",
        title: "Security Models",
        objective: "3.2",
        quick: "Security models formalize how subjects, objects, and rules protect confidentiality, integrity, or access.",
        simple: "Models are exam shorthand. Know what each model is trying to protect.",
        technical: "Bell-LaPadula emphasizes confidentiality with no read up and no write down. Biba emphasizes integrity with no read down and no write up. Clark-Wilson uses well-formed transactions and separation of duties.",
        why: "Model questions are usually about the protected property and allowed information flow.",
        example: "A military classification system maps naturally to Bell-LaPadula because confidentiality dominates.",
        manager: "Uses models to reason about policy goals and assurance.",
        engineer: "Maps model rules to access controls, workflows, and validation mechanisms.",
        trap: "Mixing Bell-LaPadula confidentiality rules with Biba integrity rules.",
        related: ["Bell-LaPadula", "Biba", "Clark-Wilson", "Brewer-Nash"],
        hook: "BLP keeps secrets. Biba keeps truth.",
        check: "Which model prevents lower-integrity input from contaminating higher-integrity data?"
      }
    ]
  },
  {
    id: "d4",
    number: 4,
    name: "Communication and Network Security",
    weight: 13,
    objectiveSummary: "Network architecture, secure components, channels, protocols, segmentation and availability.",
    objectives: [
      "4.1 Secure network architecture",
      "4.2 Secure network components",
      "4.3 Secure communication channels"
    ],
    concepts: [
      {
        id: "network-segmentation",
        title: "Network Segmentation",
        objective: "4.1",
        quick: "Segmentation limits trust and blast radius by separating systems based on sensitivity, function, and risk.",
        simple: "Do not let every system talk to every other system. Put boundaries where compromise should stop.",
        technical: "Segmentation uses VLANs, subnets, firewalls, ACLs, microsegmentation, SDN policy, NAC, and zero trust controls to enforce permitted flows and monitoring points.",
        why: "CISSP tests whether architecture supports least privilege and containment.",
        example: "A database tier accepts traffic only from application servers, while admin access goes through privileged access workflows and logged jump paths.",
        manager: "Approves zones based on business risk and compliance needs.",
        engineer: "Builds rules, routing, policy enforcement, and monitoring.",
        trap: "Assuming VLAN separation alone is enough without enforcement and monitoring.",
        related: ["DMZ", "Zero trust", "NAC", "Microsegmentation"],
        hook: "Separate, allow only needed flows, watch the crossings.",
        check: "What is the main risk reduction goal of segmentation?"
      },
      {
        id: "secure-protocols",
        title: "Secure Protocol Selection",
        objective: "4.3",
        quick: "Secure protocol selection chooses channels that provide needed confidentiality, integrity, authentication, and availability.",
        simple: "Pick protocols for the risk of the communication, not because they are familiar.",
        technical: "Examples include TLS for web transport, SSH for administrative access, IPsec for network-layer tunnels, WPA3 for wireless, DNSSEC for DNS integrity, and S/MIME or PGP for email content protection.",
        why: "Questions often ask which protocol fits a particular layer or communication need.",
        example: "A vendor API should use TLS with strong certificate validation instead of sending secrets over plain HTTP behind a private IP.",
        manager: "Requires approved protocol standards and exception handling.",
        engineer: "Disables weak versions, configures cipher suites, and validates certificates.",
        trap: "Treating a private network as a substitute for transport protection.",
        related: ["TLS", "IPsec", "SSH", "DNSSEC"],
        hook: "Private is not protected until the channel proves it.",
        check: "Which protocol protects web traffic in transit?"
      },
      {
        id: "availability-design",
        title: "Network Availability Design",
        objective: "4.1",
        quick: "Availability design removes single points of failure and plans capacity, resilience, and recovery.",
        simple: "A secure network that fails under normal disruption does not meet the mission.",
        technical: "Design options include redundant links, diverse carriers, load balancing, DDoS protection, routing failover, QoS, capacity planning, monitoring, and tested recovery procedures.",
        why: "CISSP balances confidentiality, integrity, and availability with business requirements.",
        example: "A global IdP deployment uses regional redundancy and tested failover because identity outage can stop every dependent application.",
        manager: "Sets uptime requirements and funds resilience proportional to business impact.",
        engineer: "Implements redundancy, failover, and monitoring.",
        trap: "Adding redundancy without testing failover paths.",
        related: ["SPOF", "Load balancing", "DDoS", "BCP"],
        hook: "Redundant is not resilient until tested.",
        check: "What should validate a network failover design?"
      }
    ]
  },
  {
    id: "d5",
    number: 5,
    name: "Identity and Access Management",
    weight: 13,
    objectiveSummary: "Identity lifecycle, authentication, authorization, federation, access control and accountability.",
    objectives: [
      "5.1 Physical and logical asset access",
      "5.2 Identification and authentication",
      "5.3 Federated identity",
      "5.4 Identity lifecycle",
      "5.5 Authentication systems",
      "5.6 Authorization mechanisms"
    ],
    concepts: [
      {
        id: "least-privilege",
        title: "Least Privilege",
        objective: "5.6",
        quick: "Least privilege grants only the access needed, for only as long as needed, to perform an authorized task.",
        simple: "Give people and systems enough access to do the job, not enough to make every future job convenient.",
        technical: "Least privilege is implemented with RBAC, ABAC, just-in-time access, PAM, separation of duties, access reviews, conditional access, and removal during lifecycle events.",
        why: "CISSP asks for scalable governance of access, especially for privileged accounts.",
        example: "CyberArk checks out domain admin credentials only after approval, records the session, and rotates the password afterward.",
        manager: "Defines access policy, reviews exceptions, and enforces accountability.",
        engineer: "Implements roles, groups, PAM, policies, and entitlement cleanup.",
        trap: "Approving permanent admin rights because the user occasionally needs them.",
        related: ["PAM", "RBAC", "JIT access", "Separation of duties"],
        hook: "Enough access, short enough time, clear enough owner.",
        check: "What IAM control best reduces standing privileged access?"
      },
      {
        id: "federation",
        title: "Federated Identity",
        objective: "5.3",
        quick: "Federation lets one trusted identity provider authenticate users for another service.",
        simple: "The app trusts the identity provider to say who the user is and what claims apply.",
        technical: "Federation uses protocols such as SAML, OAuth 2.0, and OpenID Connect. Claims, tokens, trust relationships, certificate validation, audience, issuer, scopes, and lifecycle controls matter.",
        why: "The exam tests protocol purpose and trust boundaries.",
        example: "Okta or Entra ID authenticates employees into a SaaS app using SAML assertions or OIDC tokens.",
        manager: "Approves trust relationships, assurance requirements, and third-party identity risk.",
        engineer: "Configures claims, certificates, scopes, session controls, and deprovisioning.",
        trap: "Confusing OAuth authorization with authentication by itself.",
        related: ["SAML", "OAuth 2.0", "OIDC", "Claims"],
        hook: "SAML and OIDC say who. OAuth grants what.",
        check: "Which layer adds authentication on top of OAuth 2.0?"
      },
      {
        id: "identity-lifecycle",
        title: "Identity Lifecycle",
        objective: "5.4",
        quick: "Identity lifecycle manages joiner, mover, leaver, and periodic review activities.",
        simple: "Access should follow a person's real job and disappear when the job changes or ends.",
        technical: "Lifecycle controls include authoritative sources, provisioning, approvals, role changes, access certification, SoD checks, suspension, deprovisioning, and account reconciliation.",
        why: "The exam favors process controls that prevent orphaned, excessive, or conflicting access.",
        example: "Active Directory and Entra ID groups update from HR events, and leaver workflows disable accounts promptly across SaaS and privileged vaults.",
        manager: "Owns access governance and review accountability.",
        engineer: "Automates provisioning, reconciliation, and deprovisioning integrations.",
        trap: "Removing only network access while SaaS accounts remain active.",
        related: ["Provisioning", "Deprovisioning", "Access review", "SoD"],
        hook: "Join cleanly, move carefully, leave completely.",
        check: "What process detects access that no longer matches a user's job?"
      }
    ]
  },
  {
    id: "d6",
    number: 6,
    name: "Security Assessment and Testing",
    weight: 12,
    objectiveSummary: "Assessment strategy, audits, testing, vulnerability management, control validation and reporting.",
    objectives: [
      "6.1 Assessment, test and audit strategies",
      "6.2 Security control testing",
      "6.3 Security process data",
      "6.4 Test outputs",
      "6.5 Security audits"
    ],
    concepts: [
      {
        id: "vulnerability-management",
        title: "Vulnerability Management",
        objective: "6.2",
        quick: "Vulnerability management continuously identifies, prioritizes, remediates, and validates weaknesses.",
        simple: "Scanning is only the first move. The program matters when findings are prioritized, fixed, and verified.",
        technical: "A program includes asset inventory, authenticated scanning, risk ranking, exception management, remediation SLAs, compensating controls, retesting, metrics, and executive reporting.",
        why: "CISSP expects lifecycle management rather than a one-time scan.",
        example: "A critical internet-facing flaw gets emergency remediation, while a lower-risk internal issue follows normal SLA with documented exception handling.",
        manager: "Sets policy, risk thresholds, SLAs, and exception approvals.",
        engineer: "Scans, validates, patches, hardens, and verifies closure.",
        trap: "Ranking every vulnerability by CVSS alone without asset criticality or exposure.",
        related: ["Patch management", "Risk ranking", "Control testing", "Metrics"],
        hook: "Find, rank, fix, prove.",
        check: "Why should asset criticality modify vulnerability priority?"
      },
      {
        id: "audit-vs-assessment",
        title: "Audit vs Assessment",
        objective: "6.5",
        quick: "An audit provides independent evidence against criteria; an assessment evaluates security posture and gaps.",
        simple: "Assessment helps you improve. Audit tells whether you meet a standard or requirement.",
        technical: "Audits compare evidence to defined criteria and require independence. Assessments may be internal, consultative, risk-focused, or technical and can include control testing, interviews, and evidence review.",
        why: "Questions often hinge on independence, criteria, and assurance.",
        example: "An internal team assesses logging maturity. An independent auditor tests whether PCI DSS logging requirements are met.",
        manager: "Defines audit scope, accepts findings, and sponsors remediation.",
        engineer: "Produces evidence and fixes control gaps.",
        trap: "Letting the control owner be the sole auditor of their own control.",
        related: ["Assurance", "Evidence", "Internal audit", "Control owner"],
        hook: "Assessment improves. Audit assures.",
        check: "What quality must an auditor have to provide credible assurance?"
      },
      {
        id: "penetration-testing",
        title: "Penetration Testing",
        objective: "6.2",
        quick: "Penetration testing safely attempts exploitation to demonstrate impact and validate defenses.",
        simple: "A pentest answers, 'Can this weakness become a real business problem?'",
        technical: "Rules of engagement define scope, timing, authorization, methods, safety limits, reporting, and retesting. Test types include black-box, gray-box, white-box, internal, external, and red team exercises.",
        why: "CISSP emphasizes authorization, scope, and business-safe testing.",
        example: "A red team tests whether phishing plus weak conditional access can reach sensitive financial systems.",
        manager: "Approves scope, risk, timing, and response expectations.",
        engineer: "Conducts testing, validates findings, and supports remediation.",
        trap: "Starting exploitation without written authorization and rules of engagement.",
        related: ["Rules of engagement", "Red team", "Vulnerability scan", "Retest"],
        hook: "Permission, scope, proof, cleanup.",
        check: "What document should be approved before a penetration test starts?"
      }
    ]
  },
  {
    id: "d7",
    number: 7,
    name: "Security Operations",
    weight: 13,
    objectiveSummary: "Operations, logging, incident response, recovery, investigations, change, monitoring and resilience.",
    objectives: [
      "7.1 Investigations",
      "7.2 Logging and monitoring",
      "7.3 Provisioning resources",
      "7.4 Resource protection",
      "7.5 Incident management",
      "7.6 Preventive measures",
      "7.7 Change management",
      "7.8 Recovery strategies",
      "7.9 Disaster recovery"
    ],
    concepts: [
      {
        id: "incident-response",
        title: "Incident Response Lifecycle",
        objective: "7.5",
        quick: "Incident response prepares for, detects, analyzes, contains, eradicates, recovers from, and learns from incidents.",
        simple: "Have the plan before the incident. During the incident, contain damage and coordinate evidence, communications, and recovery.",
        technical: "Lifecycle models include preparation; detection and analysis; containment, eradication, and recovery; and post-incident activity. Roles, escalation, legal, HR, communications, and evidence handling must be defined.",
        why: "CISSP questions test ordered response and management coordination.",
        example: "A ransomware event triggers containment of affected segments, executive communications, legal consultation, forensic imaging, restoration, and lessons learned.",
        manager: "Coordinates business impact, decisions, communications, legal, and lessons learned.",
        engineer: "Analyzes indicators, contains systems, eradicates threats, and restores services.",
        trap: "Erasing systems before preserving evidence when an investigation is needed.",
        related: ["Containment", "Forensics", "Chain of custody", "Lessons learned"],
        hook: "Prepare, detect, contain, recover, learn.",
        check: "Which phase should capture lessons learned?"
      },
      {
        id: "change-management",
        title: "Change Management",
        objective: "7.7",
        quick: "Change management controls production modifications so risk, approval, testing, rollback, and communication are handled.",
        simple: "Production should not change because someone can change it. It changes because the risk is understood and approved.",
        technical: "A change process includes request, risk assessment, impact analysis, testing, CAB or approval path, implementation window, rollback plan, documentation, and post-implementation review.",
        why: "CISSP links operations stability to formal control of change.",
        example: "A firewall rule allowing a partner feed requires business justification, security review, expiration, testing, and owner approval.",
        manager: "Owns policy, approval thresholds, and exception governance.",
        engineer: "Implements approved changes and documents results.",
        trap: "Treating emergency changes as exempt from documentation and later review.",
        related: ["CAB", "Rollback", "Baseline", "Configuration management"],
        hook: "Request, risk, approve, test, roll back.",
        check: "What should every production change include in case it fails?"
      },
      {
        id: "forensics",
        title: "Forensic Evidence Handling",
        objective: "7.1",
        quick: "Forensic evidence handling preserves integrity, custody, and admissibility of evidence.",
        simple: "If evidence may matter legally, collect and track it so another person can trust it later.",
        technical: "Controls include authorization, minimal handling, imaging, hashing, time synchronization, documentation, secure storage, chain of custody, and separation of original evidence from analysis copies.",
        why: "The exam asks how to preserve evidence before remediation destroys it.",
        example: "Before rebuilding a compromised server, investigators image the disk, hash it, document custody, and analyze a copy.",
        manager: "Decides when legal, HR, law enforcement, or external forensics are needed.",
        engineer: "Preserves systems and logs without contaminating evidence.",
        trap: "Logging into a compromised host and changing timestamps before imaging.",
        related: ["Chain of custody", "Hashing", "Legal hold", "Investigation type"],
        hook: "Hash it, handle it, hand it off with proof.",
        check: "What record shows who controlled evidence over time?"
      }
    ]
  },
  {
    id: "d8",
    number: 8,
    name: "Software Development Security",
    weight: 10,
    objectiveSummary: "SDLC, secure coding, acquired software, application security testing and software risk.",
    objectives: [
      "8.1 Security in the SDLC",
      "8.2 Security controls in development ecosystems",
      "8.3 Software security effectiveness",
      "8.4 Acquired software",
      "8.5 Secure coding guidelines"
    ],
    concepts: [
      {
        id: "secure-sdlc",
        title: "Secure SDLC",
        objective: "8.1",
        quick: "A secure SDLC integrates security requirements, design review, testing, and release controls into each development phase.",
        simple: "Security is cheaper and stronger when it is part of the build process, not a final gate after launch.",
        technical: "Secure SDLC includes threat modeling, secure requirements, architecture review, coding standards, SAST, DAST, SCA, secrets management, CI/CD controls, release approvals, and post-release monitoring.",
        why: "CISSP expects governance across the lifecycle, including acquired and cloud software.",
        example: "A team adds abuse cases, dependency scanning, code review, and deployment approvals to a customer portal pipeline.",
        manager: "Requires security gates, risk acceptance, and supplier accountability.",
        engineer: "Builds controls into code, pipelines, tests, and deployment.",
        trap: "Relying only on penetration testing at the end of development.",
        related: ["Threat modeling", "SAST", "DAST", "SCA"],
        hook: "Shift left, govern all the way right.",
        check: "Which SDLC activity identifies abuse cases before coding?"
      },
      {
        id: "input-validation",
        title: "Input Validation",
        objective: "8.5",
        quick: "Input validation ensures data is checked for type, length, format, range, and context before use.",
        simple: "Do not trust input just because it came from a friendly screen or internal service.",
        technical: "Strong validation uses allowlists, canonicalization, server-side checks, output encoding, parameterized queries, and context-specific handling to prevent injection and logic abuse.",
        why: "Many application flaws come from treating untrusted input as commands or trusted data.",
        example: "A login workflow validates user input server-side and uses parameterized queries rather than building SQL strings.",
        manager: "Requires secure coding standards and testing coverage.",
        engineer: "Implements validation, encoding, and safe APIs.",
        trap: "Using client-side validation as the only security control.",
        related: ["Injection", "Canonicalization", "Output encoding", "Parameterized queries"],
        hook: "Validate input, encode output, parameterize commands.",
        check: "Why is client-side validation insufficient by itself?"
      },
      {
        id: "third-party-software",
        title: "Third-Party Software Risk",
        objective: "8.4",
        quick: "Third-party software risk covers commercial, open-source, managed, and cloud components that enter the software supply chain.",
        simple: "You own the risk of software you use, even when someone else wrote it.",
        technical: "Controls include vendor due diligence, SBOMs, dependency scanning, license review, patch monitoring, contract terms, secure configuration, isolation, and exit planning.",
        why: "CISSP asks leaders to manage supplier and component risk across the lifecycle.",
        example: "A SaaS procurement reviews SOC reports, data handling, breach notification, identity integration, and exit terms before approval.",
        manager: "Approves supplier risk and contractual safeguards.",
        engineer: "Tracks dependencies, vulnerabilities, configurations, and integration controls.",
        trap: "Assuming open-source components are safe because many people can review them.",
        related: ["SCA", "SBOM", "Vendor risk", "SaaS"],
        hook: "If you ship it or depend on it, you manage it.",
        check: "What artifact lists software components and dependency versions?"
      }
    ]
  }
];

applyContentPack(getContentPack());

const questions = [
  {
    id: "q1",
    domain: "d1",
    concept: "risk-treatment",
    mode: "scenario",
    difficulty: 3,
    prompt: "A critical system has an expensive risk that exceeds the organization's stated appetite. The technical team recommends the strongest possible control, but it would delay a required business launch by six months. What should the security leader do first?",
    answers: [
      "Accept the risk because business deadlines are more important than security.",
      "Evaluate treatment options with business stakeholders against risk appetite, cost, and mission impact.",
      "Implement the strongest control because critical systems always require maximum protection.",
      "Transfer all risk to cyber insurance and proceed with launch."
    ],
    correct: 1,
    explanation: "The CISSP mindset starts with business-aligned risk management. Treatment should be selected with accountable stakeholders after comparing mitigation, transfer, avoidance, and acceptance.",
    distractors: [
      "Acceptance requires accountable approval and is not automatic.",
      "This is the best answer because it uses governance and risk appetite.",
      "Maximum protection may be wasteful or harmful if it ignores business impact.",
      "Insurance can transfer financial impact, not accountability or all operational risk."
    ],
    principle: "Risk treatment and governance",
    perspective: "Management"
  },
  {
    id: "q2",
    domain: "d1",
    concept: "business-continuity",
    mode: "scenario",
    difficulty: 2,
    prompt: "A company wants to choose a backup architecture for its order-processing platform. Which activity should happen before selecting the backup technology?",
    answers: [
      "Run a business impact analysis to define recovery priorities.",
      "Buy the backup product with the shortest advertised recovery time.",
      "Ask the infrastructure team to select the cheapest storage tier.",
      "Run a penetration test against the platform."
    ],
    correct: 0,
    explanation: "A BIA defines critical processes, dependencies, RTO, RPO, and maximum tolerable downtime. Technology choices should follow those requirements.",
    distractors: [
      "Correct. BIA should guide recovery technology.",
      "Tool selection before requirements is a common trap.",
      "Cost matters, but only after requirements are understood.",
      "Pentesting may be useful, but it does not define continuity requirements."
    ],
    principle: "BIA before recovery design",
    perspective: "Management"
  },
  {
    id: "q3",
    domain: "d1",
    concept: "due-care-diligence",
    mode: "concept",
    difficulty: 2,
    prompt: "A security team reviews a vendor's SOC report, penetration test summary, and data flow diagrams before signing a contract. What does this best demonstrate?",
    answers: [
      "Due care",
      "Due diligence",
      "Risk acceptance",
      "Compensating control operation"
    ],
    correct: 1,
    explanation: "Investigating and gathering evidence before a decision is due diligence. Due care is the reasonable action taken as a result.",
    distractors: [
      "Due care is action, such as enforcing controls.",
      "Correct. This is investigation before decision.",
      "Risk acceptance is formal approval of residual risk.",
      "A compensating control offsets risk when the primary control is not feasible."
    ],
    principle: "Governance accountability",
    perspective: "Management"
  },
  {
    id: "q4",
    domain: "d2",
    concept: "data-classification",
    mode: "concept",
    difficulty: 2,
    prompt: "Who is accountable for deciding the classification of a dataset containing customer financial records?",
    answers: [
      "The data custodian",
      "The data owner",
      "The help desk manager",
      "The cloud provider"
    ],
    correct: 1,
    explanation: "The data owner is accountable for classification and access decisions. Custodians implement controls on the owner's behalf.",
    distractors: [
      "Custodians operate controls but do not own the business decision.",
      "Correct. Owners are accountable for classification.",
      "The help desk may support users but does not own classification.",
      "A provider may host data but does not decide business sensitivity."
    ],
    principle: "Data ownership",
    perspective: "Management"
  },
  {
    id: "q5",
    domain: "d2",
    concept: "data-lifecycle",
    mode: "scenario",
    difficulty: 3,
    prompt: "An application stores old customer records indefinitely because storage is inexpensive. Privacy counsel warns this creates unnecessary exposure. What is the best next step?",
    answers: [
      "Encrypt all records and keep them forever.",
      "Define retention requirements with business and legal owners, then enforce disposal when no longer needed.",
      "Move the records to cheaper archival storage without changing retention.",
      "Give only administrators access to the old data."
    ],
    correct: 1,
    explanation: "Retention should be justified by business, legal, and regulatory requirements. Data that is no longer needed should be disposed of securely unless a hold applies.",
    distractors: [
      "Encryption helps protection but does not solve excessive retention.",
      "Correct. This aligns privacy, retention, and lifecycle control.",
      "Archival does not reduce privacy exposure by itself.",
      "Access reduction helps but does not answer retention risk."
    ],
    principle: "Data minimization and retention",
    perspective: "Management"
  },
  {
    id: "q6",
    domain: "d2",
    concept: "privacy-by-design",
    mode: "scenario",
    difficulty: 2,
    prompt: "A product team wants to collect optional demographic data because it might be useful later. Which privacy principle argues against this?",
    answers: [
      "Data minimization",
      "Defense in depth",
      "Nonrepudiation",
      "Fail secure"
    ],
    correct: 0,
    explanation: "Data minimization means collecting only what is necessary for a defined purpose.",
    distractors: [
      "Correct. Unneeded collection increases privacy risk.",
      "Defense in depth is layered security, not collection limitation.",
      "Nonrepudiation proves an action cannot be plausibly denied.",
      "Fail secure describes safe failure behavior."
    ],
    principle: "Privacy by design",
    perspective: "Management"
  },
  {
    id: "q7",
    domain: "d3",
    concept: "secure-design",
    mode: "concept",
    difficulty: 2,
    prompt: "Which secure design principle requires every access request to be checked rather than relying on a previous decision?",
    answers: [
      "Open design",
      "Complete mediation",
      "Economy of mechanism",
      "Security through obscurity"
    ],
    correct: 1,
    explanation: "Complete mediation means every access to every object is checked for authorization.",
    distractors: [
      "Open design means security should not depend on secrecy of design.",
      "Correct. Every request is mediated.",
      "Economy of mechanism favors simple designs.",
      "Security through obscurity is not a secure design principle."
    ],
    principle: "Secure architecture principles",
    perspective: "Technical"
  },
  {
    id: "q8",
    domain: "d3",
    concept: "crypto-use",
    mode: "concept",
    difficulty: 2,
    prompt: "A business needs proof that a specific sender approved a contract and cannot credibly deny it later. Which mechanism best supports this?",
    answers: [
      "Symmetric encryption",
      "Digital signature",
      "Data masking",
      "Network segmentation"
    ],
    correct: 1,
    explanation: "Digital signatures support integrity, authentication, and nonrepudiation when private keys are controlled properly.",
    distractors: [
      "Symmetric encryption protects confidentiality but does not provide nonrepudiation.",
      "Correct. Signing provides proof tied to a private key.",
      "Masking reduces data exposure.",
      "Segmentation limits network paths."
    ],
    principle: "Cryptographic security properties",
    perspective: "Technical"
  },
  {
    id: "q9",
    domain: "d3",
    concept: "security-models",
    mode: "concept",
    difficulty: 3,
    prompt: "Which model is primarily designed to preserve integrity using rules such as no read down and no write up?",
    answers: [
      "Bell-LaPadula",
      "Biba",
      "Brewer-Nash",
      "Clark-Wilson only"
    ],
    correct: 1,
    explanation: "Biba focuses on integrity. Bell-LaPadula focuses on confidentiality.",
    distractors: [
      "Bell-LaPadula protects confidentiality with no read up and no write down.",
      "Correct. Biba protects integrity.",
      "Brewer-Nash addresses conflict of interest.",
      "Clark-Wilson protects integrity through well-formed transactions, but the stated simple rules are Biba."
    ],
    principle: "Formal security models",
    perspective: "Technical"
  },
  {
    id: "q10",
    domain: "d4",
    concept: "network-segmentation",
    mode: "scenario",
    difficulty: 3,
    prompt: "A flat internal network allows workstations to connect directly to database servers. What is the primary security value of adding enforced segmentation?",
    answers: [
      "It guarantees that vulnerabilities disappear.",
      "It limits lateral movement and reduces blast radius.",
      "It replaces the need for identity controls.",
      "It makes encryption unnecessary."
    ],
    correct: 1,
    explanation: "Segmentation enforces boundaries and permitted flows, limiting compromise spread and reducing blast radius.",
    distractors: [
      "Segmentation does not remove vulnerabilities.",
      "Correct. Containment is the primary value.",
      "Identity controls are still needed.",
      "Encryption may still be needed for data in transit."
    ],
    principle: "Defense in depth and least privilege",
    perspective: "Technical"
  },
  {
    id: "q11",
    domain: "d4",
    concept: "secure-protocols",
    mode: "concept",
    difficulty: 1,
    prompt: "Which protocol is the standard choice for protecting web traffic in transit?",
    answers: [
      "SNMPv1",
      "TLS",
      "Telnet",
      "FTP"
    ],
    correct: 1,
    explanation: "TLS protects web traffic by providing encrypted and authenticated transport when configured correctly.",
    distractors: [
      "SNMPv1 is not appropriate for protecting web traffic.",
      "Correct. HTTPS uses TLS.",
      "Telnet is plaintext.",
      "FTP is plaintext unless protected by separate mechanisms."
    ],
    principle: "Secure channels",
    perspective: "Technical"
  },
  {
    id: "q12",
    domain: "d4",
    concept: "availability-design",
    mode: "scenario",
    difficulty: 2,
    prompt: "A network team adds redundant links to a critical site. What should validate that the design actually improves resilience?",
    answers: [
      "A tested failover exercise",
      "A longer password policy",
      "A new data classification label",
      "A signed acceptable use policy"
    ],
    correct: 0,
    explanation: "Redundancy must be tested to prove failover works under realistic conditions.",
    distractors: [
      "Correct. Testing turns design into evidence.",
      "Password policy does not validate network failover.",
      "Classification does not test availability.",
      "Acceptable use policy does not prove resilience."
    ],
    principle: "Availability assurance",
    perspective: "Technical"
  },
  {
    id: "q13",
    domain: "d5",
    concept: "least-privilege",
    mode: "scenario",
    difficulty: 2,
    prompt: "A database administrator needs elevated rights for a monthly maintenance window. Which approach best supports least privilege?",
    answers: [
      "Grant permanent global administrator rights.",
      "Use approved just-in-time privileged access for the maintenance window.",
      "Share a standing admin account among the DBA team.",
      "Disable logging during maintenance to avoid noise."
    ],
    correct: 1,
    explanation: "Just-in-time privileged access limits standing privilege and provides accountability.",
    distractors: [
      "Permanent rights exceed need.",
      "Correct. Time-bounded access fits the task.",
      "Shared accounts reduce accountability.",
      "Disabling logs weakens monitoring."
    ],
    principle: "Least privilege and accountability",
    perspective: "Management"
  },
  {
    id: "q14",
    domain: "d5",
    concept: "federation",
    mode: "concept",
    difficulty: 2,
    prompt: "Which protocol layer is commonly used to add authentication on top of OAuth 2.0?",
    answers: [
      "OpenID Connect",
      "RADIUS",
      "LDAP",
      "Kerberos"
    ],
    correct: 0,
    explanation: "OpenID Connect is an identity layer built on OAuth 2.0 that supports authentication.",
    distractors: [
      "Correct. OIDC adds authentication and identity claims.",
      "RADIUS is often used for network authentication.",
      "LDAP is a directory access protocol.",
      "Kerberos is a ticket-based authentication protocol."
    ],
    principle: "Federated identity protocols",
    perspective: "Technical"
  },
  {
    id: "q15",
    domain: "d5",
    concept: "identity-lifecycle",
    mode: "scenario",
    difficulty: 3,
    prompt: "An employee transfers from finance to engineering. Months later, they still have access to payment approval systems. Which process should have detected this?",
    answers: [
      "Access certification or review",
      "Packet filtering",
      "Certificate pinning",
      "Data remanence"
    ],
    correct: 0,
    explanation: "Access reviews verify that entitlements still match job duties, especially after mover events.",
    distractors: [
      "Correct. Reviews catch stale access.",
      "Packet filtering controls network traffic.",
      "Certificate pinning validates certificates.",
      "Data remanence is residual data left after deletion."
    ],
    principle: "Identity lifecycle governance",
    perspective: "Management"
  },
  {
    id: "q16",
    domain: "d6",
    concept: "vulnerability-management",
    mode: "scenario",
    difficulty: 3,
    prompt: "Two servers have the same high-CVSS vulnerability. One is internet-facing and processes payments; the other is isolated in a lab. What should drive remediation priority?",
    answers: [
      "CVSS score only",
      "Asset criticality, exposure, exploitability, and business impact",
      "Alphabetical order of hostnames",
      "The age of the operating system only"
    ],
    correct: 1,
    explanation: "Risk-based prioritization considers technical severity plus context such as exposure, criticality, and impact.",
    distractors: [
      "CVSS is useful but incomplete.",
      "Correct. Context changes risk.",
      "Hostnames are irrelevant.",
      "OS age alone is not enough."
    ],
    principle: "Risk-based vulnerability management",
    perspective: "Management"
  },
  {
    id: "q17",
    domain: "d6",
    concept: "audit-vs-assessment",
    mode: "concept",
    difficulty: 2,
    prompt: "What is most important for an audit that is intended to provide credible assurance?",
    answers: [
      "Independence from the control owner",
      "Use of the newest scanning tool",
      "Avoiding documented criteria",
      "Reporting only positive results"
    ],
    correct: 0,
    explanation: "Audits need independence and defined criteria to provide credible assurance.",
    distractors: [
      "Correct. Independence reduces bias.",
      "Tools can help but do not create assurance by themselves.",
      "Audits require criteria.",
      "Findings must be accurate, not selectively positive."
    ],
    principle: "Audit assurance",
    perspective: "Management"
  },
  {
    id: "q18",
    domain: "d6",
    concept: "penetration-testing",
    mode: "scenario",
    difficulty: 2,
    prompt: "Before a penetration test begins, what must be approved to keep the work authorized and safe?",
    answers: [
      "Rules of engagement",
      "A public press release",
      "A data retention schedule",
      "A password reset campaign"
    ],
    correct: 0,
    explanation: "Rules of engagement define authorization, scope, methods, safety limits, timing, and reporting.",
    distractors: [
      "Correct. Authorization and scope are essential.",
      "Publicity is not required and may be harmful.",
      "Retention is a data lifecycle control.",
      "Password resets do not authorize testing."
    ],
    principle: "Authorized testing",
    perspective: "Management"
  },
  {
    id: "q19",
    domain: "d7",
    concept: "incident-response",
    mode: "scenario",
    difficulty: 3,
    prompt: "A compromised server may be evidence in a legal investigation. What should the team prioritize before rebuilding it?",
    answers: [
      "Preserve evidence through approved forensic collection.",
      "Wipe the server immediately to restore confidence.",
      "Post details publicly to warn customers.",
      "Disable all logs to protect privacy."
    ],
    correct: 0,
    explanation: "When legal or investigative value exists, evidence should be preserved before actions that alter it.",
    distractors: [
      "Correct. Preserve first when evidence matters.",
      "Wiping destroys evidence.",
      "Communications should be coordinated and approved.",
      "Logs are often evidence and should not be disabled reflexively."
    ],
    principle: "Incident response and evidence preservation",
    perspective: "Management"
  },
  {
    id: "q20",
    domain: "d7",
    concept: "change-management",
    mode: "concept",
    difficulty: 2,
    prompt: "What should every production change include in case implementation fails?",
    answers: [
      "A rollback plan",
      "An expired certificate",
      "A shared administrator account",
      "A disabled monitoring rule"
    ],
    correct: 0,
    explanation: "A rollback plan supports controlled recovery if the change has unexpected impact.",
    distractors: [
      "Correct. Rollback is part of controlled change.",
      "Expired certificates create outages.",
      "Shared admin accounts reduce accountability.",
      "Monitoring should not be disabled without control."
    ],
    principle: "Controlled change",
    perspective: "Management"
  },
  {
    id: "q21",
    domain: "d7",
    concept: "forensics",
    mode: "concept",
    difficulty: 2,
    prompt: "Which record demonstrates who handled evidence from collection through storage and transfer?",
    answers: [
      "Chain of custody",
      "Service level agreement",
      "Asset depreciation schedule",
      "Acceptable use policy"
    ],
    correct: 0,
    explanation: "Chain of custody documents evidence possession, handling, and transfer over time.",
    distractors: [
      "Correct. It proves custody history.",
      "SLA defines service expectations.",
      "Depreciation is financial accounting.",
      "AUP defines user behavior."
    ],
    principle: "Forensic integrity",
    perspective: "Technical"
  },
  {
    id: "q22",
    domain: "d8",
    concept: "secure-sdlc",
    mode: "scenario",
    difficulty: 3,
    prompt: "A team discovers major authorization design flaws during a final pre-release penetration test. What process improvement would best prevent this pattern?",
    answers: [
      "Add threat modeling and security requirements earlier in the SDLC.",
      "Stop doing penetration tests.",
      "Move all developers to production administrator roles.",
      "Delay logging until after launch."
    ],
    correct: 0,
    explanation: "Threat modeling and security requirements identify design flaws before code is complete, reducing late rework.",
    distractors: [
      "Correct. Shift security into earlier lifecycle phases.",
      "Pentests still provide value.",
      "Production admin rights increase risk.",
      "Logging should be designed and tested before launch."
    ],
    principle: "Secure SDLC",
    perspective: "Management"
  },
  {
    id: "q23",
    domain: "d8",
    concept: "input-validation",
    mode: "concept",
    difficulty: 2,
    prompt: "Why is client-side input validation insufficient as a security control?",
    answers: [
      "Users can bypass or alter client-side controls.",
      "It always breaks encryption.",
      "It prevents all injection attacks.",
      "It replaces output encoding."
    ],
    correct: 0,
    explanation: "Attackers can bypass browser controls and submit requests directly. Server-side validation remains required.",
    distractors: [
      "Correct. Never trust the client alone.",
      "Validation does not inherently break encryption.",
      "Client-side checks do not prevent all injection.",
      "Output encoding is still required for context-specific output."
    ],
    principle: "Secure coding",
    perspective: "Technical"
  },
  {
    id: "q24",
    domain: "d8",
    concept: "third-party-software",
    mode: "concept",
    difficulty: 2,
    prompt: "What artifact lists software components and dependency versions to support supply-chain visibility?",
    answers: [
      "SBOM",
      "RTO",
      "NDA",
      "MOU"
    ],
    correct: 0,
    explanation: "A software bill of materials identifies components and versions so teams can assess exposure to vulnerabilities and license risk.",
    distractors: [
      "Correct. SBOM supports software supply-chain visibility.",
      "RTO is recovery time objective.",
      "NDA is a confidentiality agreement.",
      "MOU describes agreement between parties."
    ],
    principle: "Software supply-chain risk",
    perspective: "Management"
  }
];

questions.push(...buildSupplementalPracticeQuestions(domains));

const conceptCheckQuestions = {
  "risk-treatment": {
    answers: ["The accountable business or risk owner", "The tool administrator", "The cyber insurance broker", "The vulnerability scanner"],
    correct: 0,
    explanation: "Residual risk is accepted by accountable business or risk leadership, not by the technical implementer alone.",
    distractors: ["Correct. Accountability sits with the risk owner.", "Administrators implement controls but do not own business risk.", "Insurance can transfer some financial impact but does not accept all residual risk.", "A scanner identifies findings; it cannot approve risk."]
  },
  "due-care-diligence": {
    answers: ["Due diligence", "Due care", "Nonrepudiation", "Data remanence"],
    correct: 0,
    explanation: "A third-party security questionnaire investigates risk before a decision, so it is due diligence.",
    distractors: ["Correct. Investigation before decision is diligence.", "Care is the responsible action taken afterward.", "Nonrepudiation proves an action cannot be denied.", "Data remanence is leftover recoverable data."]
  },
  "business-continuity": {
    answers: ["Business impact analysis", "Source code review", "Password spraying test", "Asset disposal certificate"],
    correct: 0,
    explanation: "A BIA identifies maximum tolerable downtime, recovery objectives, dependencies, and business priorities.",
    distractors: ["Correct. The BIA defines continuity requirements.", "Code review does not define business recovery priority.", "Password testing does not define downtime tolerance.", "Disposal certificates prove destruction, not continuity requirements."]
  },
  "data-classification": {
    answers: ["Data owner", "Data custodian", "End user", "Internet service provider"],
    correct: 0,
    explanation: "The data owner is accountable for classification and access decisions.",
    distractors: ["Correct. Owners decide classification.", "Custodians implement and operate controls.", "Users follow handling rules.", "Providers may host connectivity but do not own classification."]
  },
  "data-lifecycle": {
    answers: ["Apply a legal hold before normal deletion", "Delete immediately because the schedule says so", "Move records to public storage", "Disable all audit logs"],
    correct: 0,
    explanation: "A legal hold overrides normal disposal so relevant records are preserved.",
    distractors: ["Correct. Holds preserve records for legal need.", "Deletion could destroy required evidence.", "Public storage increases exposure.", "Audit logs are usually important evidence."]
  },
  "privacy-by-design": {
    answers: ["Data minimization", "Kerberos", "RAID mirroring", "Security through obscurity"],
    correct: 0,
    explanation: "Data minimization argues against collecting personal data without a defined need.",
    distractors: ["Correct. Collect only what is necessary.", "Kerberos is an authentication protocol.", "RAID supports availability.", "Obscurity is not a privacy principle."]
  },
  "secure-design": {
    answers: ["Complete mediation", "Open design", "Data remanence", "Risk transfer"],
    correct: 0,
    explanation: "Complete mediation requires checking each access request.",
    distractors: ["Correct. Every access is checked.", "Open design says security should not depend on secret design.", "Data remanence concerns residual data.", "Risk transfer shifts some impact to another party."]
  },
  "crypto-use": {
    answers: ["Digital signature", "Symmetric encryption alone", "Data compression", "Network address translation"],
    correct: 0,
    explanation: "A digital signature supports nonrepudiation when the private key is controlled.",
    distractors: ["Correct. Signatures provide proof tied to a private key.", "Shared symmetric keys do not provide strong nonrepudiation.", "Compression is not a security proof.", "NAT is not a proof mechanism."]
  },
  "security-models": {
    answers: ["Biba", "Bell-LaPadula", "OAuth", "DNSSEC"],
    correct: 0,
    explanation: "Biba is the classic integrity model that prevents contamination of higher-integrity data.",
    distractors: ["Correct. Biba protects integrity.", "Bell-LaPadula protects confidentiality.", "OAuth delegates authorization.", "DNSSEC protects DNS integrity."]
  },
  "network-segmentation": {
    answers: ["Limit lateral movement and blast radius", "Make vulnerabilities impossible", "Replace identity governance", "Remove the need for monitoring"],
    correct: 0,
    explanation: "Segmentation limits permitted paths so compromise is harder to spread.",
    distractors: ["Correct. Containment is the core value.", "Segmentation does not eliminate vulnerabilities.", "Identity governance is still required.", "Monitoring remains necessary."]
  },
  "secure-protocols": {
    answers: ["TLS", "Telnet", "FTP", "SNMPv1"],
    correct: 0,
    explanation: "TLS is the standard protocol used by HTTPS to protect web traffic in transit.",
    distractors: ["Correct. HTTPS uses TLS.", "Telnet is plaintext.", "FTP is plaintext unless protected separately.", "SNMPv1 is not appropriate for web transport protection."]
  },
  "availability-design": {
    answers: ["A failover exercise", "A longer banner message", "A new logo", "A disabled alert"],
    correct: 0,
    explanation: "A failover exercise validates that redundant paths work as designed.",
    distractors: ["Correct. Resilience needs evidence through testing.", "A banner does not test failover.", "Branding does not validate availability.", "Disabling alerts reduces visibility."]
  },
  "least-privilege": {
    answers: ["Just-in-time privileged access", "Permanent domain admin rights", "A shared administrator password", "No logging for admin sessions"],
    correct: 0,
    explanation: "JIT access limits standing privilege and creates a narrower accountable access window.",
    distractors: ["Correct. It reduces standing access.", "Permanent admin rights exceed need.", "Shared passwords reduce accountability.", "Admin sessions should be logged."]
  },
  "federation": {
    answers: ["OpenID Connect", "FTP", "ARP", "ICMP"],
    correct: 0,
    explanation: "OpenID Connect adds identity and authentication semantics on top of OAuth 2.0.",
    distractors: ["Correct. OIDC is the identity layer.", "FTP transfers files.", "ARP resolves local network addresses.", "ICMP supports control and diagnostic messages."]
  },
  "identity-lifecycle": {
    answers: ["Access certification or review", "Degaussing", "NAT translation", "RAID rebuild"],
    correct: 0,
    explanation: "Access certification detects entitlements that no longer match a user's role.",
    distractors: ["Correct. Reviews catch stale access.", "Degaussing destroys magnetic media data.", "NAT translates network addresses.", "RAID rebuild restores disk redundancy."]
  },
  "vulnerability-management": {
    answers: ["Because exposure and business impact change risk", "Because hostname length changes exploitability", "Because all CVSS scores are wrong", "Because labs must always patch first"],
    correct: 0,
    explanation: "The same technical flaw can carry different business risk depending on exposure, criticality, and exploitability.",
    distractors: ["Correct. Context changes priority.", "Hostname length is irrelevant.", "CVSS is useful but incomplete, not automatically wrong.", "Patch order should be risk-based."]
  },
  "audit-vs-assessment": {
    answers: ["Independence", "Shared ownership of the control", "No written criteria", "Only verbal evidence"],
    correct: 0,
    explanation: "Auditors need independence from the control owner and criteria to provide credible assurance.",
    distractors: ["Correct. Independence reduces bias.", "Shared ownership undermines independence.", "Criteria are required.", "Evidence should be reliable and documented."]
  },
  "penetration-testing": {
    answers: ["Rules of engagement", "Marketing copy", "A public exploit announcement", "An unsigned verbal request"],
    correct: 0,
    explanation: "Rules of engagement define scope, authorization, methods, safety limits, timing, and reporting.",
    distractors: ["Correct. Written authorization and scope come first.", "Marketing copy does not authorize testing.", "Public exploit news does not define safe scope.", "Verbal requests are not enough for accountable testing."]
  },
  "incident-response": {
    answers: ["Post-incident activity", "Initial procurement", "Data classification", "Normal user onboarding"],
    correct: 0,
    explanation: "Lessons learned are captured during post-incident activity after containment and recovery.",
    distractors: ["Correct. This is where improvement is captured.", "Procurement is not an IR phase.", "Classification is asset security work.", "Onboarding is personnel or identity lifecycle work."]
  },
  "change-management": {
    answers: ["Rollback plan", "Permanent emergency status", "Suppressed monitoring", "Undocumented admin access"],
    correct: 0,
    explanation: "A rollback plan allows controlled recovery if the change creates unacceptable impact.",
    distractors: ["Correct. Rollback is essential.", "Emergency changes still need review and documentation.", "Monitoring should not be suppressed without control.", "Undocumented admin access weakens accountability."]
  },
  "forensics": {
    answers: ["Chain of custody", "Risk appetite statement", "Service catalog", "Subnet mask"],
    correct: 0,
    explanation: "Chain of custody records who controlled evidence and when.",
    distractors: ["Correct. It tracks evidence handling.", "Risk appetite defines acceptable risk.", "A service catalog lists services.", "A subnet mask defines network addressing."]
  },
  "secure-sdlc": {
    answers: ["Threat modeling", "Final-only penetration testing", "Post-launch requirements", "Disabling source control"],
    correct: 0,
    explanation: "Threat modeling identifies abuse cases and design risks before coding is complete.",
    distractors: ["Correct. It belongs early.", "Final-only testing catches issues late.", "Requirements should be defined before implementation.", "Source control supports governance and traceability."]
  },
  "input-validation": {
    answers: ["Users can bypass client-side controls", "Browsers always encrypt form values", "Client checks replace server checks", "Validation prevents every possible flaw"],
    correct: 0,
    explanation: "Attackers can bypass browser validation and send crafted requests directly, so server-side validation is required.",
    distractors: ["Correct. Never trust the client alone.", "Encryption is separate from validation.", "Server checks are still required.", "Validation is important but not a universal fix."]
  },
  "third-party-software": {
    answers: ["SBOM", "RPO", "MTD", "NAT"],
    correct: 0,
    explanation: "A software bill of materials lists software components and versions.",
    distractors: ["Correct. SBOM supports dependency visibility.", "RPO is recovery point objective.", "MTD is maximum tolerable downtime.", "NAT translates network addresses."]
  }
};

const retestQuestions = domains.flatMap((domain) => domain.concepts.map((concept) => {
  const base = questions.find((question) => question.concept === concept.id);
  const check = conceptCheckQuestions[concept.id] || concept.checkQuestion || makeFallbackCheckQuestion(concept);
  return {
    id: `r-${concept.id}`,
    domain: domain.id,
    concept: concept.id,
    mode: "retest",
    difficulty: base?.difficulty || 2,
    prompt: `Retest: ${concept.check}`,
    answers: check.answers,
    correct: check.correct,
    explanation: check.explanation,
    distractors: check.distractors,
    principle: base?.principle || "CISSP decision rule",
    perspective: base?.perspective || "Management"
  };
}));

const allQuestions = [...questions, ...retestQuestions];

const baseFlashcards = [
  ["fc1", "d1", "risk-treatment", "The four common risk treatment choices", "Mitigate, transfer, avoid, and accept. CISSP expects the choice to align with business risk appetite.", "Process"],
  ["fc2", "d1", "due-care-diligence", "Due care vs due diligence", "Due diligence investigates. Due care acts reasonably based on what was found.", "Comparison"],
  ["fc3", "d1", "business-continuity", "BIA comes before what?", "Before recovery technology selection. It defines RTO, RPO, MTD, dependencies, and priorities.", "Sequence"],
  ["fc4", "d2", "data-classification", "Who classifies data?", "The data owner is accountable; custodians implement controls.", "Definition"],
  ["fc5", "d2", "data-lifecycle", "Data retention exam trap", "Keeping data forever increases exposure. Retention needs business, legal, and privacy justification.", "Trap"],
  ["fc6", "d2", "privacy-by-design", "Data minimization", "Collect only data needed for a defined purpose, keep it only as long as justified.", "Definition"],
  ["fc7", "d3", "secure-design", "Complete mediation", "Every access request to every object is checked for authorization.", "Definition"],
  ["fc8", "d3", "crypto-use", "Encrypt, hash, sign", "Encrypt for secrecy. Hash for integrity. Sign for proof and nonrepudiation.", "Memory hook"],
  ["fc9", "d3", "security-models", "Bell-LaPadula vs Biba", "Bell-LaPadula protects confidentiality. Biba protects integrity.", "Comparison"],
  ["fc10", "d4", "network-segmentation", "Primary value of segmentation", "Limits lateral movement and reduces blast radius by enforcing boundaries.", "Definition"],
  ["fc11", "d4", "secure-protocols", "TLS protects what?", "Web and other application traffic in transit when configured correctly.", "Definition"],
  ["fc12", "d4", "availability-design", "Redundancy becomes resilience when...", "It is tested through failover exercises and monitored in operation.", "Cloze"],
  ["fc13", "d5", "least-privilege", "Best control for occasional privileged work", "Just-in-time privileged access with approval, logging, and removal.", "Scenario"],
  ["fc14", "d5", "federation", "SAML, OAuth, OIDC", "SAML and OIDC can authenticate. OAuth delegates authorization. OIDC is identity on OAuth 2.0.", "Comparison"],
  ["fc15", "d5", "identity-lifecycle", "Joiner, mover, leaver", "Provision, adjust, review, and deprovision access as roles change.", "Process"],
  ["fc16", "d6", "vulnerability-management", "Risk-based vulnerability priority uses...", "Severity, exploitability, asset criticality, exposure, and business impact.", "Formula"],
  ["fc17", "d6", "audit-vs-assessment", "Audit vs assessment", "Assessment improves posture. Audit provides independent assurance against criteria.", "Comparison"],
  ["fc18", "d6", "penetration-testing", "Before a pentest starts", "Approve written rules of engagement covering authorization, scope, methods, timing, and safety limits.", "Sequence"],
  ["fc19", "d7", "incident-response", "Incident response phases", "Prepare, detect/analyze, contain/eradicate/recover, and lessons learned.", "Process"],
  ["fc20", "d7", "change-management", "Every production change needs...", "Risk review, approval, testing, documentation, communication, and rollback.", "Cloze"],
  ["fc21", "d7", "forensics", "Chain of custody", "A record proving who handled evidence, when, why, and under what conditions.", "Definition"],
  ["fc22", "d8", "secure-sdlc", "Threat modeling belongs where?", "Early in the SDLC, before design flaws become expensive code and production risk.", "Sequence"],
  ["fc23", "d8", "input-validation", "Input validation rule", "Validate server-side, prefer allowlists, encode output, and parameterize commands.", "Memory hook"],
  ["fc24", "d8", "third-party-software", "SBOM", "A software bill of materials lists components and dependency versions for supply-chain visibility.", "Definition"],
  ["fc25", "d1", "risk-treatment", "High-confidence incorrect answer", "Treat it as a misconception first, not a careless miss. Review the rule and retest with a different question.", "Governance"],
  ["fc26", "d5", "least-privilege", "Standing privilege trap", "Permanent privileged access is rarely the best answer when JIT or PAM can meet the business need.", "Trap"],
  ["fc27", "d8", "third-party-software", "Open-source misconception", "Public source availability does not remove the organization's duty to assess, patch, and monitor components.", "Misconception"],
  ["fc28", "d4", "secure-protocols", "Private network misconception", "A private route is not the same as an authenticated, encrypted channel.", "Misconception"]
].map(([id, domain, concept, front, back, type]) => ({ id, domain, concept, front, back, type }));

baseFlashcards.push(...buildConceptFlashcards(domains, baseFlashcards));

function getContentPack() {
  return typeof globalThis !== "undefined" ? globalThis.CISSP_SUPPLEMENTAL_CONTENT : null;
}

function uniqueStrings(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function applyContentPack(pack) {
  if (!pack) return;
  if (Array.isArray(pack.sources)) {
    for (const source of pack.sources) {
      const exists = sourceRefs.some((item) => item.id === source.id || item.title === source.title);
      if (!exists) sourceRefs.push(source);
    }
  }
  for (const patch of pack.domains || []) {
    const domain = domains.find((item) => item.id === patch.id);
    if (!domain) continue;
    if (patch.objectiveSummary) domain.objectiveSummary = patch.objectiveSummary;
    if (Array.isArray(patch.objectives) && patch.objectives.length) domain.objectives = patch.objectives;
    domain.sourceSynthesis = uniqueStrings([...(domain.sourceSynthesis || []), ...(patch.sourceSynthesis || [])]);
    domain.studyPath = uniqueStrings([...(domain.studyPath || []), ...(patch.studyPath || [])]);
    for (const concept of patch.concepts || []) {
      const existing = domain.concepts.find((item) => item.id === concept.id);
      if (existing) {
        Object.assign(existing, concept);
      } else {
        domain.concepts.push(concept);
      }
    }
  }
}

function buildSupplementalPracticeQuestions(sourceDomains) {
  const rows = [];
  for (const domain of sourceDomains) {
    for (const concept of domain.concepts) {
      if (questions.some((question) => question.concept === concept.id)) continue;
      const practice = concept.practiceQuestion || concept.practice;
      if (!practice) continue;
      const fallback = makeFallbackCheckQuestion(concept);
      rows.push({
        id: `q-${concept.id}`,
        domain: domain.id,
        concept: concept.id,
        mode: practice.mode || "scenario",
        difficulty: practice.difficulty || 2,
        prompt: practice.prompt || concept.check,
        answers: practice.answers || fallback.answers,
        correct: Number.isInteger(practice.correct) ? practice.correct : fallback.correct,
        explanation: practice.explanation || fallback.explanation,
        distractors: practice.distractors || fallback.distractors,
        principle: practice.principle || concept.why || "CISSP decision rule",
        perspective: practice.perspective || "Management"
      });
    }
  }
  return rows;
}

function makeFallbackCheckQuestion(concept) {
  const best = concept.checkAnswer || concept.quick || concept.hook || concept.title;
  return {
    answers: [
      best,
      "Choose the newest technical control before understanding the business need.",
      "Delegate the decision entirely to a tool or vendor.",
      "Ignore documentation because the team already understands the system."
    ],
    correct: 0,
    explanation: concept.checkExplanation || concept.why || concept.simple || "The best answer follows the CISSP management-first decision rule.",
    distractors: [
      "Correct. This answer aligns the control with the concept and business objective.",
      "A tool-first answer often skips governance, risk, or requirements.",
      "Vendors and tools can support decisions but do not own accountability.",
      "CISSP favors documented, repeatable, auditable decisions."
    ]
  };
}

function buildConceptFlashcards(sourceDomains, existingCards) {
  const covered = new Set(existingCards.map((card) => card.concept));
  const cards = [];
  for (const domain of sourceDomains) {
    for (const concept of domain.concepts) {
      if (covered.has(concept.id)) continue;
      const card = concept.flashcard || {};
      cards.push({
        id: `fc-${concept.id}`,
        domain: domain.id,
        concept: concept.id,
        front: card.front || `${concept.title}: exam hook`,
        back: card.back || `${concept.hook || concept.quick} Trap: ${concept.trap}`,
        type: card.type || "Concept"
      });
      covered.add(concept.id);
    }
  }
  return cards;
}

let state = null;
let dbPromise = null;
let searchCache = null;

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pct(value) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function daysUntilExam() {
  if (!state.settings.examDate) return null;
  const exam = new Date(`${state.settings.examDate}T00:00:00`).getTime();
  if (Number.isNaN(exam)) return null;
  return Math.ceil((exam - todayStart()) / MS_DAY);
}

function defaultDomainStats() {
  return Object.fromEntries(domains.map((domain) => [
    domain.id,
    { seen: 0, correct: 0, confidenceTotal: 0, lastSeen: null, concepts: {} }
  ]));
}

function defaultDomainGates() {
  return Object.fromEntries(domains.map((domain) => [
    domain.id,
    { passed: false, attempts: 0, lastScore: null, lastCompletedAt: null, lastWeakConcepts: [] }
  ]));
}

function makeDefaultState() {
  return {
    version: APP_VERSION,
    activeView: "dashboard",
    selectedDomain: "d1",
    selectedConcept: "risk-treatment",
    settings: {
      examDate: "",
      weekdayHours: 2,
      weekendHours: 4,
      sessionLength: 50
    },
    domainStats: defaultDomainStats(),
    domainGates: defaultDomainGates(),
    attempts: [],
    errors: [],
    cardReviews: {},
    notes: {},
    readinessHistory: [],
    diagnosticCompleted: false,
    diagnosticSummary: null,
    session: null,
    cardSession: null,
    commandOpen: false,
    commandQuery: "",
    searchQuery: "",
    errorFilter: "open",
    practiceMode: "mixed",
    toast: ""
  };
}

function mergeState(saved) {
  const base = makeDefaultState();
  const merged = { ...base, ...(saved || {}) };
  merged.settings = { ...base.settings, ...(saved?.settings || {}) };
  merged.domainStats = { ...defaultDomainStats(), ...(saved?.domainStats || {}) };
  merged.domainGates = { ...defaultDomainGates(), ...(saved?.domainGates || {}) };
  for (const domain of domains) {
    merged.domainStats[domain.id] = {
      ...defaultDomainStats()[domain.id],
      ...(saved?.domainStats?.[domain.id] || {}),
      concepts: { ...(saved?.domainStats?.[domain.id]?.concepts || {}) }
    };
    merged.domainGates[domain.id] = {
      ...defaultDomainGates()[domain.id],
      ...(saved?.domainGates?.[domain.id] || {})
    };
  }
  merged.attempts = Array.isArray(saved?.attempts) ? saved.attempts : [];
  merged.errors = Array.isArray(saved?.errors) ? saved.errors : [];
  merged.cardReviews = saved?.cardReviews || {};
  merged.notes = saved?.notes || {};
  merged.readinessHistory = Array.isArray(saved?.readinessHistory) ? saved.readinessHistory : [];
  return merged;
}

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function dbGet(key) {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  } catch {
    const raw = localStorage.getItem(`${DB_NAME}:${key}`);
    return raw ? JSON.parse(raw) : null;
  }
}

async function dbSet(key, value) {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put({ key, value, updatedAt: new Date().toISOString() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(`${DB_NAME}:${key}`, JSON.stringify(value));
  }
}

async function dbClear() {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.removeItem(`${DB_NAME}:${STATE_KEY}`);
  }
}

async function saveState(showToast) {
  state.version = APP_VERSION;
  await dbSet(STATE_KEY, state);
  if (showToast) {
    state.toast = showToast;
    setTimeout(() => {
      if (state?.toast === showToast) {
        state.toast = "";
        render();
      }
    }, 2200);
  }
}

function domainById(id) {
  return domains.find((domain) => domain.id === id) || domains[0];
}

function conceptById(id) {
  for (const domain of domains) {
    const concept = domain.concepts.find((item) => item.id === id);
    if (concept) return { domain, concept };
  }
  return { domain: domains[0], concept: domains[0].concepts[0] };
}

function questionById(id) {
  return allQuestions.find((question) => question.id === id);
}

function cardById(id) {
  return baseFlashcards.find((card) => card.id === id);
}

function domainIndex(domainId) {
  return Math.max(0, domains.findIndex((domain) => domain.id === domainId));
}

function previousDomain(domainId) {
  const index = domainIndex(domainId);
  return index > 0 ? domains[index - 1] : null;
}

function nextDomain(domainId) {
  const index = domainIndex(domainId);
  return index >= 0 && index < domains.length - 1 ? domains[index + 1] : null;
}

function isDomainPassed(domainId) {
  return Boolean(state?.domainGates?.[domainId]?.passed);
}

function isDomainUnlocked(domainId) {
  const index = domainIndex(domainId);
  if (index === 0) return true;
  return isDomainPassed(domains[index - 1].id);
}

function currentStudyDomain() {
  return domains.find((domain) => isDomainUnlocked(domain.id) && !isDomainPassed(domain.id))
    || [...domains].reverse().find((domain) => isDomainUnlocked(domain.id))
    || domains[0];
}

function domainGateQuestions(domainId) {
  return allQuestions.filter((question) => question.domain === domainId);
}

function domainGateResult(session) {
  const total = session.answers.length;
  const correct = session.answers.filter((answer) => answer.correct).length;
  const score = total ? correct / total : 0;
  const weakConcepts = session.answers
    .filter((answer) => !answer.correct)
    .map((answer) => questionById(answer.questionId)?.concept)
    .filter(Boolean);
  return {
    total,
    correct,
    score,
    passed: total > 0 && score >= DOMAIN_GATE_PASS_RATE,
    weakConcepts: [...new Set(weakConcepts)]
  };
}

function finalizeDomainGateSession(session) {
  if (session.gateFinalized) return domainGateResult(session);
  const result = domainGateResult(session);
  const domainId = session.domainId || questionById(session.questionIds[0])?.domain || state.selectedDomain;
  const previous = state.domainGates[domainId] || defaultDomainGates()[domainId];
  state.domainGates[domainId] = {
    ...previous,
    passed: previous.passed || result.passed,
    attempts: (previous.attempts || 0) + 1,
    lastScore: result.score,
    lastCompletedAt: new Date().toISOString(),
    lastWeakConcepts: result.weakConcepts
  };
  session.gateFinalized = true;
  return result;
}

function domainScore(domainId) {
  const stats = state.domainStats[domainId] || { seen: 0, correct: 0, confidenceTotal: 0, concepts: {} };
  if (!stats.seen) return 0;
  const domain = domainById(domainId);
  const totalQuestions = allQuestions.filter((question) => question.domain === domainId).length;
  const coverage = totalQuestions ? clamp(stats.seen / Math.max(totalQuestions, 1), 0, 1) : 0;
  const accuracy = stats.seen ? stats.correct / stats.seen : 0;
  const confidence = stats.seen ? stats.confidenceTotal / (stats.seen * 5) : 0.35;
  const conceptCoverage = domain.concepts.length
    ? Object.values(stats.concepts || {}).filter((item) => item.seen > 0).length / domain.concepts.length
    : 0;
  return clamp(accuracy * 0.58 + coverage * 0.18 + conceptCoverage * 0.14 + confidence * 0.10, 0, 1);
}

function overallReadiness() {
  const weighted = domains.reduce((total, domain) => total + domainScore(domain.id) * domain.weight, 0);
  return weighted / 100;
}

function weakestDomains(limit = 3) {
  return domains
    .filter((domain) => !state?.domainGates || isDomainUnlocked(domain.id))
    .map((domain) => ({ domain, score: domainScore(domain.id) }))
    .sort((a, b) => a.score - b.score || b.domain.weight - a.domain.weight)
    .slice(0, limit);
}

function weakestConcepts(limit = 3) {
  const rows = [];
  for (const domain of domains) {
    if (state?.domainGates && !isDomainUnlocked(domain.id)) continue;
    const domainStats = state.domainStats[domain.id] || {};
    for (const concept of domain.concepts) {
      const stats = domainStats.concepts?.[concept.id] || { seen: 0, correct: 0, confidenceTotal: 0 };
      const accuracy = stats.seen ? stats.correct / stats.seen : 0;
      const weakness = (1 - accuracy) * 0.65 + (stats.seen ? 0 : 0.35) + domain.weight / 100;
      rows.push({ domain, concept, stats, weakness });
    }
  }
  return rows.sort((a, b) => b.weakness - a.weakness).slice(0, limit);
}

function dueCards() {
  const now = todayStart();
  return baseFlashcards.filter((card) => {
    const review = state.cardReviews[card.id];
    return !review || new Date(review.due).getTime() <= now;
  });
}

function recommendedQuestionsToday() {
  const days = daysUntilExam();
  const base = days === null ? 20 : days <= 3 ? 55 : days <= 7 ? 40 : days <= 14 ? 30 : 18;
  const weakBoost = weakestDomains(3).filter((row) => row.score < 0.65).length * 5;
  return base + weakBoost;
}

function generateDailyPlan() {
  const due = dueCards().length;
  const weak = weakestDomains(3);
  const concept = weakestConcepts(1)[0];
  const questionsToday = recommendedQuestionsToday();
  const length = Number(state.settings.sessionLength) || 50;
  return [
    {
      title: "Flashcard review",
      detail: `${due || 6} due cards using FSRS-style recall ratings.`,
      action: "flashcards",
      label: "Review"
    },
    {
      title: `Weak concept lesson: ${concept.concept.title}`,
      detail: `${concept.domain.name}. Read the simple explanation, manager lens, trap, and memory hook.`,
      action: "domains",
      concept: concept.concept.id,
      label: "Study"
    },
    {
      title: "Comparison or scenario drill",
      detail: `Focus on ${weak.map((row) => `Domain ${row.domain.number}`).join(", ")} before broad review.`,
      action: "practice",
      mode: "weak",
      label: "Drill"
    },
    {
      title: "Timed practice questions",
      detail: `${questionsToday} questions today. Use rapid tens until the target is met.`,
      action: "practice",
      mode: "rapid",
      label: "Start"
    },
    {
      title: "Error review",
      detail: "Resolve only by answering a different question on the same concept correctly.",
      action: "errors",
      label: "Review"
    },
    {
      title: "Updated recommendation",
      detail: `Keep sessions around ${length} minutes, then let weak-area scores change tomorrow's priority.`,
      action: "progress",
      label: "Check"
    }
  ];
}

function questionPoolForMode(mode) {
  if (mode === "diagnostic") {
    return domains.flatMap((domain) => questions.filter((question) => question.domain === domain.id).slice(0, 2));
  }
  if (mode === "domain-gate") return domainGateQuestions(state.selectedDomain);
  if (mode === "weak") {
    const weakIds = new Set(weakestDomains(3).map((row) => row.domain.id));
    return allQuestions.filter((question) => weakIds.has(question.domain));
  }
  if (mode === "rapid") return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
  if (mode === "cat") return weightedQuestionSet(24);
  if (mode === "domain") return allQuestions.filter((question) => question.domain === state.selectedDomain);
  if (mode === "learn") return allQuestions.filter((question) => question.domain === state.selectedDomain).slice(0, 8);
  return weightedQuestionSet(16);
}

function weightedQuestionSet(size) {
  const pool = [];
  for (const domain of domains) {
    const count = Math.max(1, Math.round((domain.weight / 100) * size));
    const domainQuestions = allQuestions.filter((question) => question.domain === domain.id);
    for (let index = 0; index < count; index += 1) {
      pool.push(domainQuestions[index % domainQuestions.length]);
    }
  }
  return [...pool].sort(() => Math.random() - 0.5).slice(0, size);
}

function startQuestionSession(mode) {
  const pool = questionPoolForMode(mode);
  state.session = {
    id: crypto?.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
    type: mode === "diagnostic" ? "diagnostic" : mode === "domain-gate" ? "domain-gate" : "practice",
    mode,
    domainId: state.selectedDomain,
    questionIds: pool.map((question) => question.id),
    index: 0,
    selected: null,
    confidence: 3,
    showExplanation: false,
    answers: [],
    startedAt: new Date().toISOString()
  };
}

function currentQuestion() {
  if (!state.session) return null;
  return questionById(state.session.questionIds[state.session.index]);
}

function recordAnswer(question, selected, confidence, source) {
  const correct = selected === question.correct;
  const now = new Date().toISOString();
  const domainStats = state.domainStats[question.domain] || { seen: 0, correct: 0, confidenceTotal: 0, concepts: {} };
  domainStats.seen += 1;
  domainStats.correct += correct ? 1 : 0;
  domainStats.confidenceTotal += confidence;
  domainStats.lastSeen = now;
  const conceptStats = domainStats.concepts[question.concept] || { seen: 0, correct: 0, confidenceTotal: 0, lastSeen: null };
  conceptStats.seen += 1;
  conceptStats.correct += correct ? 1 : 0;
  conceptStats.confidenceTotal += confidence;
  conceptStats.lastSeen = now;
  domainStats.concepts[question.concept] = conceptStats;
  state.domainStats[question.domain] = domainStats;
  state.attempts.push({
    id: `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    questionId: question.id,
    domain: question.domain,
    concept: question.concept,
    selected,
    correct,
    confidence,
    source,
    answeredAt: now
  });
  if (!correct) {
    const existingOpen = state.errors.find((error) => error.concept === question.concept && error.status === "open");
    if (!existingOpen) {
      state.errors.unshift({
        id: `error-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        questionId: question.id,
        domain: question.domain,
        concept: question.concept,
        selected,
        correctAnswer: question.correct,
        confidence,
        reasoning: confidence >= 4 ? "High-confidence miss: likely misconception." : confidence <= 2 ? "Low confidence: strengthen the concept map." : "Reasoning gap: review the decision rule.",
        decisionRule: question.principle,
        status: "open",
        createdAt: now,
        retestStatus: "Needs a different question on the same concept."
      });
    }
  } else {
    for (const error of state.errors) {
      if (error.status === "open" && error.concept === question.concept && error.questionId !== question.id) {
        error.status = "resolved";
        error.resolvedAt = now;
        error.retestStatus = "Resolved by a different same-concept question.";
      }
    }
  }
  updateReadinessHistory();
}

function updateReadinessHistory() {
  const score = overallReadiness();
  const today = new Date().toISOString().slice(0, 10);
  const last = state.readinessHistory[state.readinessHistory.length - 1];
  if (last?.date === today) {
    last.score = score;
  } else {
    state.readinessHistory.push({ date: today, score });
    state.readinessHistory = state.readinessHistory.slice(-30);
  }
}

function scheduleCard(cardId, rating) {
  const previous = state.cardReviews[cardId] || {
    reps: 0,
    lapses: 0,
    interval: 0,
    ease: 2.5,
    stability: 0.5,
    difficulty: 5
  };
  const now = todayStart();
  let interval = previous.interval || 0;
  let ease = previous.ease || 2.5;
  let stability = previous.stability || 0.5;
  let difficulty = previous.difficulty || 5;
  let lapses = previous.lapses || 0;

  if (rating === "again") {
    interval = 1;
    ease = Math.max(1.3, ease - 0.22);
    stability = Math.max(0.4, stability * 0.55);
    difficulty = Math.min(10, difficulty + 1.2);
    lapses += 1;
  } else if (rating === "hard") {
    interval = Math.max(2, Math.round((interval || 1) * 1.35));
    ease = Math.max(1.45, ease - 0.08);
    stability += 0.35;
    difficulty = Math.min(10, difficulty + 0.45);
  } else if (rating === "good") {
    interval = Math.max(3, Math.round((interval || 1) * ease));
    stability += 0.85;
    difficulty = Math.max(1, difficulty - 0.2);
  } else {
    interval = Math.max(5, Math.round((interval || 1) * (ease + 0.85)));
    ease = Math.min(3.2, ease + 0.08);
    stability += 1.25;
    difficulty = Math.max(1, difficulty - 0.55);
  }

  state.cardReviews[cardId] = {
    reps: previous.reps + 1,
    lapses,
    interval,
    ease,
    stability,
    difficulty,
    due: new Date(now + interval * MS_DAY).toISOString(),
    lastRating: rating,
    lastReviewed: new Date().toISOString()
  };
}

function buildSearchIndex() {
  if (searchCache) return searchCache;
  const rows = [];
  for (const domain of domains) {
    rows.push({
      type: "Domain",
      title: domain.name,
      body: `${domain.objectiveSummary} ${domain.objectives.join(" ")}`,
      action: { view: "domains", domain: domain.id }
    });
    for (const concept of domain.concepts) {
      rows.push({
        type: "Lesson",
        title: concept.title,
        body: [
          concept.quick,
          concept.simple,
          concept.technical,
          concept.why,
          concept.example,
          concept.manager,
          concept.engineer,
          concept.trap,
          concept.hook,
          concept.check,
          ...(concept.flow || []),
          ...(concept.sources || []),
          ...(concept.related || [])
        ].join(" "),
        action: { view: "domains", domain: domain.id, concept: concept.id }
      });
    }
  }
  for (const question of allQuestions) {
    rows.push({
      type: "Question",
      title: question.prompt,
      body: `${question.answers.join(" ")} ${question.explanation} ${question.principle} ${question.perspective}`,
      action: { view: "practice", mode: "learn", question: question.id }
    });
  }
  for (const card of baseFlashcards) {
    rows.push({
      type: "Flashcard",
      title: card.front,
      body: `${card.back} ${card.type}`,
      action: { view: "flashcards" }
    });
  }
  for (const ref of sourceRefs) {
    rows.push({
      type: "Source",
      title: ref.title,
      body: ref.detail,
      action: { view: "ask" }
    });
  }
  searchCache = rows;
  return rows;
}

function searchRows(query, limit = 8) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return buildSearchIndex()
    .map((row) => {
      const haystack = `${row.type} ${row.title} ${row.body}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        const hits = haystack.split(term).length - 1;
        score += hits * (row.title.toLowerCase().includes(term) ? 4 : 1);
      }
      return { ...row, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function viewTitle() {
  const item = navItems.find(([id]) => id === state.activeView);
  return item ? item[2] : "Dashboard";
}

function render() {
  const app = document.querySelector("#app");
  app.className = "";
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="workspace">
        ${renderTopbar()}
        <section class="view">${renderView()}</section>
      </main>
      ${renderContextPanel()}
    </div>
    ${renderBottomNav()}
    ${state.commandOpen ? renderCommandPalette() : ""}
    ${state.toast ? `<div class="status resolved" style="position:fixed;right:16px;bottom:82px;z-index:120;">${escapeHtml(state.toast)}</div>` : ""}
  `;
}

function renderSidebar() {
  return `
    <aside class="sidebar" aria-label="Primary navigation">
      <div class="sidebar-head">
        <div class="brand">
          <span class="brand-mark">C</span>
          <span class="brand-text">CISSP Cram</span>
        </div>
        <button class="icon-button" type="button" data-action="close-nav" aria-label="Close navigation">x</button>
      </div>
      <nav class="nav">
        ${navItems.map(([id, icon, label]) => `
          <button class="nav-button ${state.activeView === id ? "is-active" : ""}" type="button" data-action="nav" data-view="${id}">
            <span class="nav-icon">${icon}</span>
            <span>${label}</span>
            ${navBadge(id)}
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-foot">
        <div class="mini-panel">
          <strong>${formatDate(state.settings.examDate)}</strong>
          <p>${examLine()}</p>
        </div>
        <button class="ghost-button" type="button" data-action="open-command">Command palette</button>
      </div>
    </aside>
  `;
}

function navBadge(id) {
  if (id === "flashcards") return `<span class="nav-count">${dueCards().length}</span>`;
  if (id === "errors") return `<span class="nav-count">${state.errors.filter((error) => error.status === "open").length}</span>`;
  return `<span></span>`;
}

function examLine() {
  const days = daysUntilExam();
  if (days === null) return "Set your exam date to generate a two-week cram rhythm.";
  if (days < 0) return "Exam date has passed. Update settings for the next target.";
  if (days === 0) return "Exam day. Review decision rules and rest your brain.";
  return `${days} day${days === 1 ? "" : "s"} until exam.`;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <button class="icon-button mobile-menu" type="button" data-action="open-nav" aria-label="Open navigation">=</button>
      <div class="topbar-title">
        <p class="eyebrow">Local-first study system</p>
        <h1>${escapeHtml(viewTitle())}</h1>
        <p class="lead">${topbarLead()}</p>
      </div>
      <button class="ghost-button" type="button" data-action="open-command">Search / command</button>
    </header>
  `;
}

function topbarLead() {
  const leads = {
    dashboard: "Find weak CISSP domains fast, study the next concept, and keep progress on this device.",
    plan: "A daily cram loop: flashcards, weak concept, scenario drill, timed practice, error review.",
    domains: "Eight domains, official weights, plain-language explanations, traps, comparisons, and checks.",
    practice: "Original scenario questions with distractor explanations and the CISSP decision principle.",
    flashcards: "Local spaced repetition for definitions, comparisons, processes, formulas, and misconceptions.",
    errors: "Misses stay open until you answer a different question on the same concept correctly.",
    ask: "Local search across lessons, questions, cards, examples, comparisons, and source references.",
    progress: "Readiness is weighted by domain importance, accuracy, coverage, confidence, and review history.",
    settings: "Exam date, study time, JSON import/export, local reset, and offline support."
  };
  return leads[state.activeView] || leads.dashboard;
}

function renderView() {
  if (state.session) return renderQuestionSession();
  if (state.activeView === "dashboard") return renderDashboard();
  if (state.activeView === "plan") return renderStudyPlan();
  if (state.activeView === "domains") return renderDomains();
  if (state.activeView === "practice") return renderPractice();
  if (state.activeView === "flashcards") return renderFlashcards();
  if (state.activeView === "errors") return renderErrors();
  if (state.activeView === "ask") return renderAsk();
  if (state.activeView === "progress") return renderProgress();
  if (state.activeView === "settings") return renderSettings();
  return renderDashboard();
}

function renderDashboard() {
  const readiness = overallReadiness();
  const weak = weakestDomains(3);
  return `
    <div class="view-stack">
      ${!state.settings.examDate ? renderOnboarding() : ""}
      <section class="grid four">
        <article class="stat-card">
          <div class="stat-label">Days until exam</div>
          <div class="stat-value">${daysUntilExam() ?? "--"}</div>
          <div class="stat-note">${examLine()}</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Questions today</div>
          <div class="stat-value">${recommendedQuestionsToday()}</div>
          <div class="stat-note">Weighted by weak domains and urgency.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Flashcards due</div>
          <div class="stat-value">${dueCards().length}</div>
          <div class="stat-note">Rate again, hard, good, or easy.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Open mistakes</div>
          <div class="stat-value">${state.errors.filter((error) => error.status === "open").length}</div>
          <div class="stat-note">Resolve through retest, not rereading.</div>
        </article>
      </section>

      <section class="grid two">
        <article class="stat-card readiness-card">
          <div class="ring" style="--ring:${pct(readiness)}">${Math.round(readiness * 100)}%</div>
          <div>
            <h2>Overall readiness</h2>
            <p class="muted small">Weighted by official domain weight, accuracy, coverage, confidence, and concept exposure. Reading completion alone does not raise readiness.</p>
            <div class="toolbar" style="margin-top:12px;">
              <button class="button" type="button" data-action="start-diagnostic">${state.diagnosticCompleted ? "Retake diagnostic" : "Start diagnostic"}</button>
              <button class="ghost-button" type="button" data-action="start-practice" data-mode="rapid">Rapid ten</button>
            </div>
          </div>
        </article>
        <article class="stat-card">
          <h2>Weakest three objectives</h2>
          ${weak.map(({ domain, score }) => progressRow(`Domain ${domain.number}: ${domain.name}`, score)).join("")}
        </article>
      </section>

      <section class="section">
        <div class="result-head">
          <div>
            <h2>Today's study plan</h2>
            <p class="muted small">Generated from <span class="mono">Priority = Domain weight x Weakness x Question importance x Review urgency</span>.</p>
          </div>
          <button class="ghost-button" type="button" data-action="nav" data-view="plan">Open plan</button>
        </div>
        ${renderDailyList(generateDailyPlan().slice(0, 5))}
      </section>

      <section class="grid two">
        <article class="callout accent">
          <h2>Recommended next action</h2>
          <p>${nextActionText()}</p>
          <div class="toolbar">
            ${nextActionButton()}
          </div>
        </article>
        <article class="callout">
          <h2>Latest scores</h2>
          ${latestScoreText()}
        </article>
      </section>
    </div>
  `;
}

function renderOnboarding() {
  return `
    <section class="settings-panel">
      <h2>Set up two-week cram mode</h2>
      <p class="muted small">Enter your exam date and realistic study capacity. The app stores this locally in your browser.</p>
      <div class="form-grid" style="margin-top:14px;">
        ${settingsFields()}
        <button class="button" type="button" data-action="save-settings">Save plan</button>
      </div>
    </section>
  `;
}

function settingsFields() {
  return `
    <div class="field">
      <label for="exam-date">Exam date</label>
      <input class="input" id="exam-date" type="date" value="${escapeHtml(state.settings.examDate)}">
    </div>
    <div class="field">
      <label for="weekday-hours">Weekday hours</label>
      <input class="input" id="weekday-hours" type="number" min="0" step="0.5" value="${escapeHtml(state.settings.weekdayHours)}">
    </div>
    <div class="field">
      <label for="weekend-hours">Weekend hours</label>
      <input class="input" id="weekend-hours" type="number" min="0" step="0.5" value="${escapeHtml(state.settings.weekendHours)}">
    </div>
    <div class="field">
      <label for="session-length">Session length</label>
      <input class="input" id="session-length" type="number" min="15" step="5" value="${escapeHtml(state.settings.sessionLength)}">
    </div>
  `;
}

function progressRow(label, value) {
  return `
    <div class="progress-row">
      <div>
        <div class="progress-name"><span>${escapeHtml(label)}</span><span>${Math.round(value * 100)}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="--value:${pct(value)}"></div></div>
      </div>
      <span class="muted small">${value < 0.5 ? "Weak" : value < 0.75 ? "Build" : "Ready"}</span>
    </div>
  `;
}

function nextActionText() {
  if (!state.diagnosticCompleted) return "Take the mixed-domain diagnostic first. It seeds weak domains, concept gaps, and today's plan.";
  if (dueCards().length > 0) return "Clear due flashcards before new reading. Recall pressure makes weak concepts visible.";
  const openErrors = state.errors.filter((error) => error.status === "open").length;
  if (openErrors) return "Review open mistakes, then answer different questions on the same concepts to close them.";
  return "Run a rapid ten-question drill and watch for low-confidence correct answers.";
}

function nextActionButton() {
  if (!state.diagnosticCompleted) return `<button class="button" type="button" data-action="start-diagnostic">Start diagnostic</button>`;
  if (dueCards().length > 0) return `<button class="button" type="button" data-action="nav" data-view="flashcards">Review flashcards</button>`;
  if (state.errors.some((error) => error.status === "open")) return `<button class="button" type="button" data-action="nav" data-view="errors">Open notebook</button>`;
  return `<button class="button" type="button" data-action="start-practice" data-mode="rapid">Start rapid ten</button>`;
}

function latestScoreText() {
  const attempts = state.attempts.slice(-20);
  if (!attempts.length) return `<p class="muted small">No attempts yet. Diagnostic results will appear here.</p>`;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const byDomain = weakestDomains(8)
    .map(({ domain, score }) => progressRow(`Domain ${domain.number}`, score))
    .join("");
  return `<p class="muted small">Last ${attempts.length}: ${correct}/${attempts.length} correct (${Math.round(correct / attempts.length * 100)}%).</p>${byDomain}`;
}

function renderStudyPlan() {
  const days = daysUntilExam();
  const hours = weeklyHours();
  return `
    <div class="view-stack">
      <section class="grid three">
        <article class="stat-card">
          <div class="stat-label">Study capacity</div>
          <div class="stat-value">${hours}</div>
          <div class="stat-note">Hours per week from settings.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Cram window</div>
          <div class="stat-value">${days === null ? "--" : Math.max(0, Math.min(days, 14))}</div>
          <div class="stat-note">Plan focuses on the final 14 days.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">CAT-style mock</div>
          <div class="stat-value">${mockExamDayLabel()}</div>
          <div class="stat-note">At least one simulation before final review.</div>
        </article>
      </section>
      <section class="section">
        <h2>Daily session</h2>
        ${renderDailyList(generateDailyPlan())}
      </section>
      <section class="section">
        <h2>Priority queue</h2>
        <div class="grid two">
          ${weakestConcepts(6).map(({ domain, concept, stats }) => `
            <article class="result-card">
              <div class="result-head">
                <strong>${escapeHtml(concept.title)}</strong>
                <span class="pill">Domain ${domain.number}</span>
              </div>
              <p class="muted small">${escapeHtml(concept.quick)}</p>
              <p class="small">Seen ${stats.seen || 0}, correct ${stats.correct || 0}</p>
              <button class="chip-button" type="button" data-action="open-concept" data-domain="${domain.id}" data-concept="${concept.id}">Open lesson</button>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function weeklyHours() {
  return Number(state.settings.weekdayHours || 0) * 5 + Number(state.settings.weekendHours || 0) * 2;
}

function mockExamDayLabel() {
  const days = daysUntilExam();
  if (days === null) return "Set date";
  if (days <= 2) return "Today";
  if (days <= 7) return "In 2d";
  return "Day -3";
}

function renderDailyList(items) {
  return `
    <ol class="daily-list">
      ${items.map((item, index) => `
        <li class="daily-item">
          <span class="daily-step">${index + 1}</span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </div>
          <button class="chip-button" type="button" data-action="daily-action" data-view="${item.action}" data-mode="${item.mode || ""}" data-concept="${item.concept || ""}">${escapeHtml(item.label)}</button>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderDomains() {
  const { domain, concept } = conceptById(state.selectedConcept);
  let selectedDomain = domainById(state.selectedDomain || domain.id);
  if (!isDomainUnlocked(selectedDomain.id)) selectedDomain = currentStudyDomain();
  const selectedConcept = selectedDomain.concepts.find((item) => item.id === state.selectedConcept) || selectedDomain.concepts[0];
  return `
    <div class="view-stack">
      <section class="grid two">
        ${domains.map((item) => renderDomainCard(item)).join("")}
      </section>
      ${renderDomainOverview(selectedDomain)}
      <section class="section lesson-layout">
        <div class="lesson-menu">
          <h2>Concepts</h2>
          ${selectedDomain.concepts.map((item) => `
            <button class="nav-button ${item.id === selectedConcept.id ? "is-active" : ""}" type="button" data-action="open-concept" data-domain="${selectedDomain.id}" data-concept="${item.id}">
              <span class="nav-icon">${item.objective}</span>
              <span>${escapeHtml(item.title)}</span>
              <span></span>
            </button>
          `).join("")}
        </div>
        <div>
          <select class="select lesson-select" data-action="select-concept">
            ${selectedDomain.concepts.map((item) => `<option value="${item.id}" ${item.id === selectedConcept.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
          </select>
          ${renderConcept(selectedDomain, selectedConcept)}
        </div>
      </section>
    </div>
  `;
}

function renderDomainCard(domain) {
  const score = domainScore(domain.id);
  const unlocked = isDomainUnlocked(domain.id);
  const passed = isDomainPassed(domain.id);
  const gate = state.domainGates[domain.id] || {};
  const statusClass = passed ? "resolved" : unlocked ? "open" : "locked";
  const statusLabel = passed ? "Released" : unlocked ? "In study" : "Locked";
  return `
    <article class="domain-card ${unlocked ? "" : "is-locked"}">
      <div class="domain-card-head">
        <div>
          <span class="domain-number">${domain.number}</span>
          <h2 style="margin-top:10px;">${escapeHtml(domain.name)}</h2>
          <p class="domain-meta">${domain.weight}% average exam weight</p>
        </div>
        <span class="status ${statusClass}">${statusLabel}</span>
      </div>
      <p class="muted small">${escapeHtml(domain.objectiveSummary)}</p>
      <ul class="pill-list">
        ${domain.objectives.slice(0, 5).map((objective) => `<li class="pill">${escapeHtml(objective)}</li>`).join("")}
      </ul>
      ${progressRow("Readiness", score)}
      ${gate.lastScore !== null && gate.lastScore !== undefined ? `<p class="small muted">Last mastery gate: ${Math.round(gate.lastScore * 100)}% after ${gate.attempts || 0} attempt${gate.attempts === 1 ? "" : "s"}.</p>` : ""}
      ${!unlocked ? `<p class="small muted">Pass Domain ${domain.number - 1} mastery gate to unlock.</p>` : ""}
      <div class="toolbar">
        <button class="chip-button ${state.selectedDomain === domain.id ? "is-active" : ""}" type="button" data-action="select-domain" data-domain="${domain.id}" ${unlocked ? "" : "disabled"}>Open domain</button>
        <button class="chip-button" type="button" data-action="start-domain-gate" data-domain="${domain.id}" ${unlocked ? "" : "disabled"}>Mastery quiz</button>
      </div>
    </article>
  `;
}

function renderDomainOverview(domain) {
  return `
    <section class="section domain-overview">
      <div class="result-head">
        <div>
          <p class="eyebrow">Compiled domain notes</p>
          <h2>Domain ${domain.number}: ${escapeHtml(domain.name)}</h2>
        </div>
        <span class="pill">${domain.concepts.length} lessons</span>
      </div>
      <p class="lead">${escapeHtml(domain.objectiveSummary)}</p>
      ${renderDomainGatePanel(domain)}
      ${domain.sourceSynthesis?.length ? `
        <div class="callout">
          <h3>Source synthesis</h3>
          <ul class="compact-list">
            ${domain.sourceSynthesis.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      <div class="grid two">
        <div class="callout">
          <h3>Official objectives</h3>
          <ul class="compact-list">
            ${domain.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
          </ul>
        </div>
        <div class="callout">
          <h3>Suggested study path</h3>
          <ol class="compact-list">
            ${(domain.studyPath?.length ? domain.studyPath : domain.concepts.map((item) => item.title)).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
        </div>
      </div>
    </section>
  `;
}

function renderDomainGatePanel(domain) {
  const unlocked = isDomainUnlocked(domain.id);
  const passed = isDomainPassed(domain.id);
  const gate = state.domainGates[domain.id] || {};
  const previous = previousDomain(domain.id);
  const quizSize = domainGateQuestions(domain.id).length;
  const lastScore = gate.lastScore === null || gate.lastScore === undefined ? "Not attempted" : `${Math.round(gate.lastScore * 100)}%`;
  return `
    <div class="callout ${passed ? "accent" : unlocked ? "" : "warning"}">
      <div class="result-head">
        <div>
          <h3>Domain release gate</h3>
          <p class="muted small">Study the notes, then pass the full-domain mastery quiz at ${Math.round(DOMAIN_GATE_PASS_RATE * 100)}% or higher to unlock the next domain.</p>
        </div>
        <span class="status ${passed ? "resolved" : unlocked ? "open" : "locked"}">${passed ? "Released" : unlocked ? "Ready" : "Locked"}</span>
      </div>
      <div class="grid three" style="margin-top:12px;">
        <div>
          <strong>${quizSize}</strong>
          <p class="muted small">Detailed questions</p>
        </div>
        <div>
          <strong>${lastScore}</strong>
          <p class="muted small">Last gate score</p>
        </div>
        <div>
          <strong>${gate.attempts || 0}</strong>
          <p class="muted small">Attempts</p>
        </div>
      </div>
      <div class="toolbar" style="margin-top:12px;">
        ${unlocked
          ? `<button class="button" type="button" data-action="start-domain-gate" data-domain="${domain.id}">${passed ? "Retake mastery quiz" : "Start mastery quiz"}</button>`
          : `<button class="ghost-button" type="button" data-action="select-domain" data-domain="${previous?.id || "d1"}">Study previous domain</button>`
        }
      </div>
    </div>
  `;
}

function renderConcept(domain, concept) {
  const note = state.notes[concept.id] || "";
  return `
    <article class="lesson-block">
      <div class="result-head">
        <div>
          <p class="eyebrow">Domain ${domain.number} / Objective ${concept.objective}</p>
          <h2>${escapeHtml(concept.title)}</h2>
        </div>
        <button class="button" type="button" data-action="practice-concept" data-concept="${concept.id}">Practice this</button>
      </div>
      ${conceptPart("Quick definition", concept.quick)}
      ${conceptPart("Explain it simply", concept.simple)}
      ${conceptPart("Technical explanation", concept.technical)}
      ${conceptPart("Why CISSP cares", concept.why)}
      ${conceptPart("Real-world example", concept.example)}
      <div class="grid two">
        ${conceptPart("Manager perspective", concept.manager)}
        ${conceptPart("Engineer perspective", concept.engineer)}
      </div>
      ${conceptPart("Common exam trap", concept.trap, "warning")}
      ${concept.related ? `<section class="concept-section"><h3>Related concepts</h3><ul>${concept.related.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
      ${concept.comparisons ? renderComparison(concept.comparisons) : ""}
      ${concept.flow ? renderFlow(concept.flow) : ""}
      ${concept.sources ? renderConceptSources(concept.sources) : ""}
      ${conceptPart("Memory hook", concept.hook, "accent")}
      ${conceptPart("Knowledge check", concept.check)}
      <section class="concept-section">
        <h3>Notes</h3>
        <textarea class="textarea" data-action="save-note" data-concept="${concept.id}" placeholder="Capture your own decision rule, analogy, or trap.">${escapeHtml(note)}</textarea>
      </section>
    </article>
  `;
}

function conceptPart(title, body, tone) {
  return `
    <section class="concept-section ${tone ? `callout ${tone}` : ""}">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </section>
  `;
}

function renderComparison(rows) {
  return `
    <section class="concept-section">
      <h3>Closely related comparisons</h3>
      <table class="comparison">
        <tbody>
          ${rows.map(([left, right]) => `<tr><th>${escapeHtml(left)}</th><td>${escapeHtml(right)}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderFlow(steps) {
  return `
    <section class="concept-section">
      <h3>Plain-language flow</h3>
      <div class="flow-diagram">
        ${steps.map((step, index) => `
          <div class="flow-step">
            <span>${index + 1}</span>
            <strong>${escapeHtml(step)}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderConceptSources(sources) {
  return `
    <section class="concept-section">
      <h3>Source synthesis</h3>
      <ul class="compact-list">
        ${sources.map((source) => `<li>${escapeHtml(source)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderPractice() {
  const selectedDomain = domainById(state.selectedDomain);
  return `
    <div class="view-stack">
      <section class="settings-panel">
        <h2>Practice engine</h2>
        <p class="muted small">Each original question explains the best answer, each distractor, the CISSP principle, and whether the expected lens is management or technical.</p>
        <div class="toolbar" style="margin-top:14px;">
          ${["learn", "domain", "domain-gate", "weak", "mixed", "rapid", "cat"].map((mode) => `
            <button class="segment-button ${state.practiceMode === mode ? "is-active" : ""}" type="button" data-action="set-practice-mode" data-mode="${mode}">${practiceLabel(mode)}</button>
          `).join("")}
        </div>
      </section>
      ${state.practiceMode === "domain" || state.practiceMode === "domain-gate" || state.practiceMode === "learn" ? `
        <section class="settings-panel">
          <h2>Selected domain</h2>
          <select class="select" data-action="select-domain-input">
            ${domains.map((domain) => `<option value="${domain.id}" ${domain.id === selectedDomain.id ? "selected" : ""} ${isDomainUnlocked(domain.id) ? "" : "disabled"}>Domain ${domain.number}: ${escapeHtml(domain.name)}${isDomainUnlocked(domain.id) ? "" : " - locked"}</option>`).join("")}
          </select>
        </section>
      ` : ""}
      <section class="grid three">
        <article class="stat-card">
          <div class="stat-label">Mode</div>
          <div class="stat-value" style="font-size:1.35rem;">${practiceLabel(state.practiceMode)}</div>
          <div class="stat-note">${practiceDescription(state.practiceMode)}</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Question pool</div>
          <div class="stat-value">${questionPoolForMode(state.practiceMode).length}</div>
          <div class="stat-note">Original scenario and concept questions.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Open concept gaps</div>
          <div class="stat-value">${state.errors.filter((error) => error.status === "open").length}</div>
          <div class="stat-note">Correct same-concept retests close them.</div>
        </article>
      </section>
      <div class="toolbar">
        <button class="button" type="button" data-action="start-practice" data-mode="${state.practiceMode}">Start ${practiceLabel(state.practiceMode)}</button>
        <button class="ghost-button" type="button" data-action="start-diagnostic">${state.diagnosticCompleted ? "Retake diagnostic" : "Start diagnostic"}</button>
      </div>
    </div>
  `;
}

function practiceLabel(mode) {
  return {
    learn: "Learn mode",
    domain: "Timed domain quiz",
    "domain-gate": "Domain mastery gate",
    weak: "Weakness drill",
    mixed: "Mixed scenarios",
    rapid: "Rapid ten",
    cat: "CAT-style simulation"
  }[mode] || "Mixed scenarios";
}

function practiceDescription(mode) {
  return {
    learn: "Immediate explanations, scoped to the selected domain.",
    domain: "Selected-domain set with exam-style explanations.",
    "domain-gate": `Full-domain mastery quiz. Score ${Math.round(DOMAIN_GATE_PASS_RATE * 100)}% or higher to unlock the next domain.`,
    weak: "Questions from your weakest weighted domains.",
    mixed: "Weighted set across domains.",
    rapid: "Ten fast questions for daily reps.",
    cat: "Weighted mock with a broader set and summary."
  }[mode] || "";
}

function renderQuestionSession() {
  const session = state.session;
  const question = currentQuestion();
  if (!question) return renderSessionSummary();
  const domain = domainById(question.domain);
  const progress = `${session.index + 1} / ${session.questionIds.length}`;
  return `
    <div class="view-stack">
      <section class="question-card">
        <div class="question-head">
          <div>
            <p class="eyebrow">${session.type === "diagnostic" ? "Diagnostic assessment" : practiceLabel(session.mode)}</p>
            <h2>Question ${progress}</h2>
            <p class="muted small">Domain ${domain.number}: ${escapeHtml(domain.name)} / ${escapeHtml(question.perspective)} lens</p>
          </div>
          <span class="status open">${escapeHtml(question.principle)}</span>
        </div>
        <p class="question-prompt">${escapeHtml(question.prompt)}</p>
        <div class="answers">
          ${question.answers.map((answer, index) => {
            const selected = session.selected === index;
            const show = session.showExplanation;
            const className = [
              "answer-option",
              selected ? "is-selected" : "",
              show && index === question.correct ? "is-correct" : "",
              show && selected && index !== question.correct ? "is-wrong" : ""
            ].filter(Boolean).join(" ");
            return `
              <button class="${className}" type="button" data-action="select-answer" data-index="${index}" ${show ? "disabled" : ""}>
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span>${escapeHtml(answer)}</span>
              </button>
            `;
          }).join("")}
        </div>
        ${session.showExplanation ? renderExplanation(question) : renderConfidence()}
        <div class="quiz-controls">
          <button class="ghost-button" type="button" data-action="end-session">End session</button>
          <div class="toolbar">
            ${session.showExplanation
              ? `<button class="button" type="button" data-action="next-question">${session.index + 1 >= session.questionIds.length ? "Finish" : "Next question"}</button>`
              : `<button class="button" type="button" data-action="submit-answer" ${session.selected === null ? "disabled" : ""}>Submit answer</button>`
            }
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderConfidence() {
  return `
    <div class="quiz-controls" style="position:static;">
      <span class="muted small">Confidence</span>
      <div class="segmented">
        ${[1, 2, 3, 4, 5].map((value) => `
          <button class="segment-button ${state.session.confidence === value ? "is-active" : ""}" type="button" data-action="set-confidence" data-confidence="${value}">
            ${value}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderExplanation(question) {
  const { concept } = conceptById(question.concept);
  return `
    <div class="explanation">
      <div>
        <h3>Why the best answer is best</h3>
        <p class="muted small">${escapeHtml(question.explanation)}</p>
      </div>
      <div class="explanation-grid">
        ${question.distractors.map((text, index) => `
          <div>
            <strong>${String.fromCharCode(65 + index)} ${index === question.correct ? "(correct)" : "(distractor)"}</strong>
            <p class="muted small">${escapeHtml(text)}</p>
          </div>
        `).join("")}
      </div>
      ${state.session?.mode === "domain-gate" ? `
        <div class="callout accent">
          <strong>Lesson tie-back: ${escapeHtml(concept.title)}</strong>
          <p class="small">${escapeHtml(concept.simple || concept.quick)}</p>
          <p class="small"><strong>Trap:</strong> ${escapeHtml(concept.trap || "Do not skip the CISSP decision rule.")}</p>
          <p class="small"><strong>Memory hook:</strong> ${escapeHtml(concept.hook || concept.quick)}</p>
        </div>
      ` : ""}
      <div class="grid two">
        <div class="callout accent">
          <strong>CISSP principle</strong>
          <p class="small">${escapeHtml(question.principle)}</p>
        </div>
        <div class="callout">
          <strong>Expected perspective</strong>
          <p class="small">${escapeHtml(question.perspective)}</p>
        </div>
      </div>
    </div>
  `;
}

function renderSessionSummary() {
  const session = state.session;
  const total = session.answers.length;
  const correct = session.answers.filter((answer) => answer.correct).length;
  const diagnostic = session.type === "diagnostic";
  if (session.type === "domain-gate") return renderDomainGateSummary(session);
  return `
    <div class="view-stack">
      <section class="result-card">
        <p class="eyebrow">${diagnostic ? "Diagnostic complete" : "Practice complete"}</p>
        <h2>${correct}/${total} correct</h2>
        <p class="muted small">${diagnostic ? "Your weak domains and first study plan are ready." : "Progress, errors, and concept stats have been saved locally."}</p>
        <div class="grid two" style="margin-top:16px;">
          ${domains.map((domain) => progressRow(`Domain ${domain.number}: ${domain.name}`, domainScore(domain.id))).join("")}
        </div>
        <div class="toolbar" style="margin-top:16px;">
          <button class="button" type="button" data-action="close-summary" data-view="${diagnostic ? "plan" : "dashboard"}">${diagnostic ? "Open study plan" : "Back to dashboard"}</button>
          <button class="ghost-button" type="button" data-action="close-summary" data-view="errors">Review mistakes</button>
          <button class="ghost-button" type="button" data-action="start-practice" data-mode="weak">Weakness drill</button>
        </div>
      </section>
    </div>
  `;
}

function renderDomainGateSummary(session) {
  const result = domainGateResult(session);
  const domain = domainById(session.domainId || state.selectedDomain);
  const next = nextDomain(domain.id);
  const passed = isDomainPassed(domain.id) || result.passed;
  const weakConceptRows = result.weakConcepts.map((conceptId) => conceptById(conceptId).concept);
  return `
    <div class="view-stack">
      <section class="result-card">
        <p class="eyebrow">Domain mastery gate complete</p>
        <h2>${passed ? "Released" : "Not released yet"}: ${correct}/${result.total} correct (${Math.round(result.score * 100)}%)</h2>
        <p class="muted small">Passing score is ${Math.round(DOMAIN_GATE_PASS_RATE * 100)}%. ${passed ? next ? `Domain ${next.number} is now unlocked.` : "All domains are released." : "Review the missed concepts, then retake the mastery quiz."}</p>
        ${weakConceptRows.length ? `
          <div class="callout warning" style="margin-top:16px;">
            <h3>Restudy before retry</h3>
            <ul class="compact-list">
              ${weakConceptRows.map((concept) => `<li><strong>${escapeHtml(concept.title)}</strong>: ${escapeHtml(concept.trap || concept.quick)}</li>`).join("")}
            </ul>
          </div>
        ` : `
          <div class="callout accent" style="margin-top:16px;">
            <h3>Clean pass</h3>
            <p class="small">No missed concepts in this gate attempt. Keep the flashcards warm so the release holds under time pressure.</p>
          </div>
        `}
        <div class="toolbar" style="margin-top:16px;">
          ${passed && next ? `<button class="button" type="button" data-action="close-summary" data-view="domains" data-domain="${next.id}">Open Domain ${next.number}</button>` : ""}
          <button class="${passed && !next ? "button" : "ghost-button"}" type="button" data-action="close-summary" data-view="domains" data-domain="${domain.id}">${passed && !next ? "Back to domains" : "Restudy domain"}</button>
          <button class="ghost-button" type="button" data-action="start-practice" data-mode="domain-gate">Retake mastery quiz</button>
          <button class="ghost-button" type="button" data-action="close-summary" data-view="errors">Review mistakes</button>
        </div>
      </section>
    </div>
  `;
}

function renderFlashcards() {
  if (state.cardSession) return renderCardSession();
  const due = dueCards();
  const reviewed = Object.keys(state.cardReviews).length;
  return `
    <div class="view-stack">
      <section class="grid three">
        <article class="stat-card">
          <div class="stat-label">Due now</div>
          <div class="stat-value">${due.length}</div>
          <div class="stat-note">Cards due today or new.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Card bank</div>
          <div class="stat-value">${baseFlashcards.length}</div>
          <div class="stat-note">Definitions, comparisons, scenarios, formulas, cloze, governance.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Reviewed</div>
          <div class="stat-value">${reviewed}</div>
          <div class="stat-note">Stored locally with due dates.</div>
        </article>
      </section>
      <section class="callout accent">
        <h2>Recall before rereading</h2>
        <p class="muted small">Use the four rating buttons. Again and hard shorten the interval; good and easy extend it. The scheduler stores stability, difficulty, interval, lapses, and due date locally.</p>
        <div class="toolbar">
          <button class="button" type="button" data-action="start-cards" data-mode="due">Review due cards</button>
          <button class="ghost-button" type="button" data-action="start-cards" data-mode="all">Browse all cards</button>
        </div>
      </section>
      <section class="grid two">
        ${baseFlashcards.slice(0, 8).map((card) => {
          const review = state.cardReviews[card.id];
          return `
            <article class="result-card">
              <div class="result-head">
                <strong>${escapeHtml(card.front)}</strong>
                <span class="pill">${escapeHtml(card.type)}</span>
              </div>
              <p class="muted small">${escapeHtml(card.back)}</p>
              <p class="small">Due: ${review ? formatDate(review.due.slice(0, 10)) : "new"}</p>
            </article>
          `;
        }).join("")}
      </section>
    </div>
  `;
}

function renderCardSession() {
  const session = state.cardSession;
  const card = cardById(session.cardIds[session.index]);
  if (!card) {
    const reviewed = session.reviewed || 0;
    return `
      <section class="result-card">
        <h2>Flashcard review complete</h2>
        <p class="muted small">${reviewed} card${reviewed === 1 ? "" : "s"} reviewed. Due dates were saved locally.</p>
        <div class="toolbar">
          <button class="button" type="button" data-action="end-cards">Done</button>
        </div>
      </section>
    `;
  }
  const domain = domainById(card.domain);
  return `
    <div class="view-stack">
      <section class="flashcard">
        ${session.revealed ? `
          <div class="flashcard-back">
            <span class="card-type">${escapeHtml(card.type)} / Domain ${domain.number}</span>
            <div class="front-text">${escapeHtml(card.front)}</div>
            <p class="back-text">${escapeHtml(card.back)}</p>
          </div>
        ` : `
          <div class="flashcard-front">
            <span class="card-type">${escapeHtml(card.type)} / Domain ${domain.number}</span>
            <div class="front-text">${escapeHtml(card.front)}</div>
            <button class="button" type="button" data-action="reveal-card">Reveal answer</button>
          </div>
        `}
      </section>
      ${session.revealed ? `
        <section>
          <div class="rating-row">
            ${["again", "hard", "good", "easy"].map((rating) => `<button class="segment-button" type="button" data-action="rate-card" data-rating="${rating}">${rating}</button>`).join("")}
          </div>
        </section>
      ` : ""}
      <div class="toolbar">
        <button class="ghost-button" type="button" data-action="end-cards">End review</button>
        <span class="muted small">${session.index + 1} / ${session.cardIds.length}</span>
      </div>
    </div>
  `;
}

function renderErrors() {
  const filter = state.errorFilter;
  const errors = state.errors.filter((error) => filter === "all" || error.status === filter);
  return `
    <div class="view-stack">
      <section class="toolbar">
        ${["open", "resolved", "all"].map((item) => `
          <button class="segment-button ${filter === item ? "is-active" : ""}" type="button" data-action="set-error-filter" data-filter="${item}">${item}</button>
        `).join("")}
        <button class="ghost-button" type="button" data-action="start-practice" data-mode="weak">Retest weak areas</button>
      </section>
      ${errors.length ? `
        <section class="grid">
          ${errors.map((error) => renderError(error)).join("")}
        </section>
      ` : `
        <section class="empty-state">
          <h2>No ${filter === "all" ? "" : filter} mistakes</h2>
          <p class="muted small">Missed questions will appear here with the related concept, decision rule, and retest status.</p>
          <button class="button" type="button" data-action="start-practice" data-mode="mixed">Start mixed practice</button>
        </section>
      `}
    </div>
  `;
}

function renderError(error) {
  const question = questionById(error.questionId);
  const { domain, concept } = conceptById(error.concept);
  return `
    <article class="error-entry">
      <div class="error-head">
        <div>
          <strong>${escapeHtml(concept.title)}</strong>
          <p class="muted small">Domain ${domain.number}: ${escapeHtml(domain.name)}</p>
        </div>
        <span class="status ${error.status === "resolved" ? "resolved" : "open"}">${escapeHtml(error.status)}</span>
      </div>
      <p class="small">${escapeHtml(question?.prompt || "Question unavailable")}</p>
      <div class="grid two">
        <div class="callout warning">
          <strong>Your answer</strong>
          <p class="small">${escapeHtml(question?.answers[error.selected] || "Not recorded")}</p>
        </div>
        <div class="callout accent">
          <strong>Best answer</strong>
          <p class="small">${escapeHtml(question?.answers[error.correctAnswer] || "Not recorded")}</p>
        </div>
      </div>
      <p class="muted small">${escapeHtml(error.reasoning)} Decision rule: ${escapeHtml(error.decisionRule)}. ${escapeHtml(error.retestStatus)}</p>
      <div class="toolbar">
        <button class="chip-button" type="button" data-action="open-concept" data-domain="${domain.id}" data-concept="${concept.id}">Related lesson</button>
        <button class="chip-button" type="button" data-action="practice-concept" data-concept="${concept.id}">Retest concept</button>
      </div>
    </article>
  `;
}

function renderAsk() {
  const results = searchRows(state.searchQuery, 10);
  return `
    <div class="view-stack">
      <section class="search-box">
        <span class="search-prefix">/</span>
        <input class="input" type="search" placeholder="Search risk, BIA, OIDC, Biba, incident response..." value="${escapeHtml(state.searchQuery)}" data-action="ask-search" autofocus>
      </section>
      ${state.searchQuery ? `
        <section class="grid">
          ${results.length ? results.map((row) => renderSearchResult(row, state.searchQuery)).join("") : `
            <div class="empty-state">
              <h2>No close match</h2>
              <p class="muted small">Try a domain name, acronym, protocol, process, or decision rule.</p>
            </div>
          `}
        </section>
      ` : `
        <section class="grid two">
          ${["risk treatment", "BIA before backup", "OAuth OIDC SAML", "Biba Bell-LaPadula", "incident evidence", "third party software"].map((query) => `
            <button class="search-result" type="button" data-action="preset-search" data-query="${query}">
              <strong>${escapeHtml(query)}</strong>
              <span class="muted small">Search lessons, examples, flashcards, and questions.</span>
            </button>
          `).join("")}
        </section>
      `}
      <section class="section">
        <h2>Source references</h2>
        <div class="grid two">
          ${sourceRefs.map((ref) => `
            <article class="result-card">
              <strong>${escapeHtml(ref.title)}</strong>
              <p class="muted small">${escapeHtml(ref.detail)}</p>
              ${ref.url ? `<a class="source-link" href="${escapeHtml(ref.url)}" target="_blank" rel="noreferrer">Open official source</a>` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderSearchResult(row, query) {
  const excerpt = highlight(excerptText(row.body, query), query);
  return `
    <article class="search-result">
      <div class="result-head">
        <span class="pill">${escapeHtml(row.type)}</span>
        <button class="chip-button" type="button" data-action="open-search-result" data-view="${row.action.view}" data-domain="${row.action.domain || ""}" data-concept="${row.action.concept || ""}" data-mode="${row.action.mode || ""}">Open</button>
      </div>
      <strong>${highlight(row.title.length > 140 ? `${row.title.slice(0, 140)}...` : row.title, query)}</strong>
      <p class="muted small">${excerpt}</p>
    </article>
  `;
}

function excerptText(text, query) {
  const lower = text.toLowerCase();
  const firstTerm = query.toLowerCase().split(/\s+/).find(Boolean) || "";
  const index = lower.indexOf(firstTerm);
  if (index < 0) return text.slice(0, 220);
  return text.slice(Math.max(0, index - 70), index + 180);
}

function highlight(text, query) {
  let safe = escapeHtml(text);
  for (const term of query.split(/\s+/).filter(Boolean).slice(0, 5)) {
    const pattern = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    safe = safe.replace(pattern, "<mark>$1</mark>");
  }
  return safe;
}

function renderProgress() {
  const readiness = overallReadiness();
  const attempts = state.attempts;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return `
    <div class="view-stack">
      <section class="grid four">
        <article class="stat-card">
          <div class="stat-label">Readiness</div>
          <div class="stat-value">${Math.round(readiness * 100)}%</div>
          <div class="stat-note">Weighted by official domain percentages.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Attempts</div>
          <div class="stat-value">${attempts.length}</div>
          <div class="stat-note">Practice and diagnostic answers.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Accuracy</div>
          <div class="stat-value">${attempts.length ? Math.round(correct / attempts.length * 100) : 0}%</div>
          <div class="stat-note">${correct}/${attempts.length} correct.</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Resolved errors</div>
          <div class="stat-value">${state.errors.filter((error) => error.status === "resolved").length}</div>
          <div class="stat-note">Closed by same-concept retest.</div>
        </article>
      </section>
      <section class="section">
        <h2>Domain readiness</h2>
        <div class="grid two">
          ${domains.map((domain) => `
            <article class="result-card">
              <div class="result-head">
                <strong>Domain ${domain.number}: ${escapeHtml(domain.name)}</strong>
                <span class="pill">${domain.weight}% weight</span>
              </div>
              ${progressRow("Readiness", domainScore(domain.id))}
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>Readiness history</h2>
        ${state.readinessHistory.length ? `
          <div class="history-strip">
            ${state.readinessHistory.map((item) => `<span class="history-bar" title="${escapeHtml(item.date)} ${Math.round(item.score * 100)}%" style="--value:${Math.max(6, Math.round(item.score * 82))}px"></span>`).join("")}
          </div>
        ` : `<p class="muted small">History begins after your first saved answer.</p>`}
      </section>
    </div>
  `;
}

function renderSettings() {
  const exportText = JSON.stringify({
    exportedAt: new Date().toISOString(),
    app: "CISSP Cram",
    version: APP_VERSION,
    state
  }, null, 2);
  return `
    <div class="view-stack">
      <section class="settings-panel">
        <h2>Study schedule</h2>
        <div class="form-grid">
          ${settingsFields()}
          <button class="button" type="button" data-action="save-settings">Save settings</button>
        </div>
      </section>
      <section class="grid two">
        <article class="settings-panel">
          <h2>Export progress</h2>
          <p class="muted small">Download a JSON backup of exam date, progress, attempts, flashcards, notes, and errors.</p>
          <textarea class="textarea mono" readonly>${escapeHtml(exportText)}</textarea>
          <div class="toolbar" style="margin-top:10px;">
            <button class="button" type="button" data-action="export-json">Download JSON</button>
          </div>
        </article>
        <article class="settings-panel">
          <h2>Import progress</h2>
          <p class="muted small">Paste a previous export. This replaces local progress after validation.</p>
          <textarea class="textarea mono" id="import-json" placeholder="Paste exported JSON here"></textarea>
          <div class="toolbar" style="margin-top:10px;">
            <button class="button" type="button" data-action="import-json">Import JSON</button>
            <button class="danger-button" type="button" data-action="reset-local">Reset local data</button>
          </div>
        </article>
      </section>
      <section class="callout">
        <h2>Offline and publishing</h2>
        <p class="muted small">The app registers a service worker after first load on HTTPS or localhost. It uses hash-free local navigation and relative asset paths so it works under a GitHub Pages repository subpath.</p>
      </section>
    </div>
  `;
}

function renderContextPanel() {
  const weak = weakestConcepts(4);
  return `
    <aside class="context-panel" aria-label="Context panel">
      <h2>Right now</h2>
      <ul class="context-list">
        <li><strong>Readiness:</strong> ${Math.round(overallReadiness() * 100)}%</li>
        <li><strong>Due cards:</strong> ${dueCards().length}</li>
        <li><strong>Open errors:</strong> ${state.errors.filter((error) => error.status === "open").length}</li>
      </ul>
      <h2 style="margin-top:22px;">Related concepts</h2>
      <ul class="context-list">
        ${weak.map(({ domain, concept }) => `
          <li>
            <button class="chip-button" type="button" data-action="open-concept" data-domain="${domain.id}" data-concept="${concept.id}">${escapeHtml(concept.title)}</button>
            <br>Domain ${domain.number}: ${escapeHtml(domain.name)}
          </li>
        `).join("")}
      </ul>
      <h2 style="margin-top:22px;">Sources</h2>
      <ul class="context-list">
        <li>Official ISC2 outline: weights and objectives effective April 15, 2024.</li>
        <li>Local EPUBs were used as reference signals; no copied chapters or question banks are published.</li>
      </ul>
    </aside>
  `;
}

function renderBottomNav() {
  const items = [
    ["dashboard", "D", "Home"],
    ["plan", "P", "Plan"],
    ["practice", "Q", "Quiz"],
    ["flashcards", "F", "Cards"],
    ["ask", "A", "Ask"]
  ];
  return `
    <nav class="bottom-nav" aria-label="Mobile navigation">
      ${items.map(([id, icon, label]) => `
        <button type="button" class="${state.activeView === id ? "is-active" : ""}" data-action="nav" data-view="${id}">
          <span>${icon}</span>
          <span>${label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderCommandPalette() {
  const builtIns = [
    { type: "Command", title: "Resume study plan", body: "Open today's adaptive study plan.", action: { view: "plan" } },
    { type: "Command", title: "Start flashcards", body: "Review due cards.", action: { view: "flashcards" } },
    { type: "Command", title: "Start quick quiz", body: "Run a rapid ten-question drill.", action: { view: "practice", mode: "rapid", start: true } },
    { type: "Command", title: "View weak areas", body: "Open progress and weakest objectives.", action: { view: "progress" } },
    { type: "Command", title: "Ask CISSP", body: "Search lessons, questions, and flashcards.", action: { view: "ask" } }
  ];
  const query = state.commandQuery;
  const results = query ? [...builtIns, ...searchRows(query, 8)] : builtIns;
  return `
    <div class="modal-backdrop" data-action="close-command-backdrop">
      <div class="command-modal" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command-head">
          <input class="input" type="search" placeholder="Open domain, search concept, start flashcards..." value="${escapeHtml(query)}" data-action="command-search" autofocus>
          <button class="icon-button" type="button" data-action="close-command" aria-label="Close command palette">x</button>
        </div>
        <div class="command-results">
          ${results.map((row) => `
            <button class="command-result" type="button" data-action="open-search-result" data-view="${row.action.view}" data-domain="${row.action.domain || ""}" data-concept="${row.action.concept || ""}" data-mode="${row.action.mode || ""}" data-start="${row.action.start ? "true" : ""}">
              <span class="nav-icon">${row.type.slice(0, 1)}</span>
              <span>
                <strong>${escapeHtml(row.title.length > 96 ? `${row.title.slice(0, 96)}...` : row.title)}</strong>
                <br><span class="muted small">${escapeHtml(row.type)}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

async function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "close-command-backdrop" && event.target !== target) return;

  if (action === "nav") {
    state.activeView = target.dataset.view;
    state.session = null;
    state.cardSession = null;
    state.commandOpen = false;
    document.body.classList.remove("nav-open");
    await saveState();
    render();
    return;
  }
  if (action === "open-nav") {
    document.body.classList.add("nav-open");
    return;
  }
  if (action === "close-nav") {
    document.body.classList.remove("nav-open");
    return;
  }
  if (action === "open-command") {
    state.commandOpen = true;
    state.commandQuery = "";
    render();
    focusSoon("[data-action='command-search']");
    return;
  }
  if (action === "close-command" || action === "close-command-backdrop") {
    state.commandOpen = false;
    render();
    return;
  }
  if (action === "save-settings") {
    readSettingsFromDom();
    await saveState("Settings saved");
    render();
    return;
  }
  if (action === "start-diagnostic") {
    startQuestionSession("diagnostic");
    state.activeView = "practice";
    await saveState();
    render();
    return;
  }
  if (action === "start-practice") {
    const mode = target.dataset.mode || state.practiceMode || "mixed";
    if ((mode === "domain" || mode === "domain-gate" || mode === "learn") && !isDomainUnlocked(state.selectedDomain)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.practiceMode = mode;
    startQuestionSession(mode);
    state.activeView = "practice";
    state.commandOpen = false;
    await saveState();
    render();
    return;
  }
  if (action === "set-practice-mode") {
    state.practiceMode = target.dataset.mode;
    await saveState();
    render();
    return;
  }
  if (action === "select-domain") {
    if (!isDomainUnlocked(target.dataset.domain)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.selectedDomain = target.dataset.domain;
    state.selectedConcept = domainById(state.selectedDomain).concepts[0].id;
    await saveState();
    render();
    return;
  }
  if (action === "start-domain-quiz") {
    if (!isDomainUnlocked(target.dataset.domain)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.selectedDomain = target.dataset.domain;
    state.practiceMode = "domain";
    startQuestionSession("domain");
    state.activeView = "practice";
    await saveState();
    render();
    return;
  }
  if (action === "start-domain-gate") {
    if (!isDomainUnlocked(target.dataset.domain)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.selectedDomain = target.dataset.domain;
    state.selectedConcept = domainById(state.selectedDomain).concepts[0].id;
    state.practiceMode = "domain-gate";
    state.activeView = "practice";
    startQuestionSession("domain-gate");
    await saveState();
    render();
    return;
  }
  if (action === "open-concept") {
    const requestedDomain = target.dataset.domain || conceptById(target.dataset.concept).domain.id;
    if (!isDomainUnlocked(requestedDomain)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.selectedDomain = requestedDomain;
    state.selectedConcept = target.dataset.concept || domainById(state.selectedDomain).concepts[0].id;
    state.activeView = "domains";
    state.session = null;
    state.commandOpen = false;
    document.body.classList.remove("nav-open");
    await saveState();
    render();
    return;
  }
  if (action === "practice-concept") {
    const conceptId = target.dataset.concept;
    const found = conceptById(conceptId);
    if (!isDomainUnlocked(found.domain.id)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    const pool = allQuestions.filter((question) => question.concept === conceptId);
    state.session = {
      id: `session-${Date.now()}`,
      type: "practice",
      mode: "concept",
      questionIds: pool.map((question) => question.id),
      index: 0,
      selected: null,
      confidence: 3,
      showExplanation: false,
      answers: [],
      startedAt: new Date().toISOString()
    };
    state.activeView = "practice";
    await saveState();
    render();
    return;
  }
  if (action === "daily-action") {
    const view = target.dataset.view;
    const mode = target.dataset.mode;
    const concept = target.dataset.concept;
    if (concept) {
      const found = conceptById(concept);
      if (!isDomainUnlocked(found.domain.id)) {
        state.toast = "Pass the previous domain gate first.";
        render();
        return;
      }
      state.selectedDomain = found.domain.id;
      state.selectedConcept = concept;
    }
    if (mode) state.practiceMode = mode;
    state.activeView = view;
    await saveState();
    render();
    return;
  }
  if (action === "select-answer") {
    if (!state.session.showExplanation) {
      state.session.selected = Number(target.dataset.index);
      render();
    }
    return;
  }
  if (action === "set-confidence") {
    state.session.confidence = Number(target.dataset.confidence);
    render();
    return;
  }
  if (action === "submit-answer") {
    const question = currentQuestion();
    if (!question || state.session.selected === null) return;
    const answer = {
      questionId: question.id,
      selected: state.session.selected,
      correct: state.session.selected === question.correct,
      confidence: state.session.confidence
    };
    state.session.answers.push(answer);
    state.session.showExplanation = true;
    recordAnswer(question, state.session.selected, state.session.confidence, state.session.type);
    await saveState();
    render();
    return;
  }
  if (action === "next-question") {
    if (state.session.index + 1 >= state.session.questionIds.length) {
      if (state.session.type === "diagnostic") {
        state.diagnosticCompleted = true;
        state.diagnosticSummary = {
          completedAt: new Date().toISOString(),
          total: state.session.answers.length,
          correct: state.session.answers.filter((answer) => answer.correct).length
        };
      } else if (state.session.type === "domain-gate") {
        finalizeDomainGateSession(state.session);
      }
      state.session.index += 1;
    } else {
      state.session.index += 1;
      state.session.selected = null;
      state.session.confidence = 3;
      state.session.showExplanation = false;
    }
    await saveState();
    render();
    return;
  }
  if (action === "end-session") {
    state.session = null;
    await saveState();
    render();
    return;
  }
  if (action === "close-summary") {
    if (target.dataset.domain) {
      state.selectedDomain = target.dataset.domain;
      state.selectedConcept = domainById(state.selectedDomain).concepts[0].id;
    }
    state.activeView = target.dataset.view || "dashboard";
    state.session = null;
    await saveState();
    render();
    return;
  }
  if (action === "start-cards") {
    const cards = target.dataset.mode === "all" ? baseFlashcards : dueCards();
    state.cardSession = {
      cardIds: (cards.length ? cards : baseFlashcards.slice(0, 8)).map((card) => card.id),
      index: 0,
      revealed: false,
      reviewed: 0
    };
    await saveState();
    render();
    return;
  }
  if (action === "reveal-card") {
    state.cardSession.revealed = true;
    render();
    return;
  }
  if (action === "rate-card") {
    const cardId = state.cardSession.cardIds[state.cardSession.index];
    scheduleCard(cardId, target.dataset.rating);
    state.cardSession.index += 1;
    state.cardSession.revealed = false;
    state.cardSession.reviewed = (state.cardSession.reviewed || 0) + 1;
    await saveState();
    render();
    return;
  }
  if (action === "end-cards") {
    state.cardSession = null;
    await saveState();
    render();
    return;
  }
  if (action === "set-error-filter") {
    state.errorFilter = target.dataset.filter;
    render();
    return;
  }
  if (action === "preset-search") {
    state.searchQuery = target.dataset.query;
    state.activeView = "ask";
    await saveState();
    render();
    return;
  }
  if (action === "open-search-result") {
    const view = target.dataset.view;
    const domain = target.dataset.domain;
    const concept = target.dataset.concept;
    const mode = target.dataset.mode;
    if (domain && !isDomainUnlocked(domain)) {
      state.toast = "Pass the previous domain gate first.";
      state.commandOpen = false;
      render();
      return;
    }
    if (domain) state.selectedDomain = domain;
    if (concept) state.selectedConcept = concept;
    if (mode) state.practiceMode = mode;
    state.activeView = view;
    state.commandOpen = false;
    if (target.dataset.start === "true") {
      startQuestionSession(mode || "rapid");
    }
    await saveState();
    render();
    return;
  }
  if (action === "export-json") {
    downloadJson();
    return;
  }
  if (action === "import-json") {
    await importJson();
    return;
  }
  if (action === "reset-local") {
    if (confirm("Reset all local CISSP Cram data on this browser?")) {
      await dbClear();
      state = makeDefaultState();
      await saveState("Local data reset");
      render();
    }
  }
}

function handleInput(event) {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "ask-search") {
    state.searchQuery = target.value;
    render();
    focusSoon("[data-action='ask-search']");
  }
  if (action === "command-search") {
    state.commandQuery = target.value;
    render();
    focusSoon("[data-action='command-search']");
  }
  if (action === "save-note") {
    state.notes[target.dataset.concept] = target.value;
    saveState();
  }
  if (action === "select-concept") {
    state.selectedConcept = target.value;
    saveState();
    render();
  }
  if (action === "select-domain-input") {
    if (!isDomainUnlocked(target.value)) {
      state.toast = "Pass the previous domain gate first.";
      render();
      return;
    }
    state.selectedDomain = target.value;
    saveState();
    render();
  }
}

function readSettingsFromDom() {
  state.settings.examDate = document.querySelector("#exam-date")?.value || "";
  state.settings.weekdayHours = Number(document.querySelector("#weekday-hours")?.value || 0);
  state.settings.weekendHours = Number(document.querySelector("#weekend-hours")?.value || 0);
  state.settings.sessionLength = Number(document.querySelector("#session-length")?.value || 50);
}

function downloadJson() {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), app: "CISSP Cram", version: APP_VERSION, state }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cissp-cram-progress-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importJson() {
  const raw = document.querySelector("#import-json")?.value;
  if (!raw?.trim()) return;
  try {
    const parsed = JSON.parse(raw);
    const incoming = parsed.state || parsed;
    state = mergeState(incoming);
    await saveState("Progress imported");
    render();
  } catch (error) {
    alert(`Import failed: ${error.message}`);
  }
}

function focusSoon(selector) {
  requestAnimationFrame(() => document.querySelector(selector)?.focus());
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

async function init() {
  state = mergeState(await dbGet(STATE_KEY));
  const hashView = location.hash.replace("#", "");
  if (navItems.some(([id]) => id === hashView)) state.activeView = hashView;
  updateReadinessHistory();
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      state.commandOpen = true;
      render();
      focusSoon("[data-action='command-search']");
    }
    if (event.key === "Escape" && state.commandOpen) {
      state.commandOpen = false;
      render();
    }
  });
  window.addEventListener("hashchange", () => {
    const view = location.hash.replace("#", "");
    if (navItems.some(([id]) => id === view)) {
      state.activeView = view;
      render();
    }
  });
  render();
  registerServiceWorker();
  await saveState();
}

init();
