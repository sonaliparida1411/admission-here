import { PrismaClient, UserRole, OwnershipType, BlogCategory, PostStatus, LeadCtaType, LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seed for Higher Education Discovery Platform...");

  // 1. Clean existing records in correct relation order
  await db.lead.deleteMany();
  await db.review.deleteMany();
  await db.agencyRanking.deleteMany();
  await db.placementStat.deleteMany();
  await db.examCutoff.deleteMany();
  await db.collegeCourse.deleteMany();
  await db.course.deleteMany();
  await db.blogPost.deleteMany();
  await db.exam.deleteMany();
  await db.college.deleteMany();
  await db.user.deleteMany();

  console.log("🧹 Cleaned database tables.");

  // 2. Create Users with RBAC
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

  const superAdmin = await db.user.create({
    data: {
      name: "Super Administrator",
      email: "superadmin@admissionhere.in",
      phone: "+919876543210",
      phoneVerified: true,
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const sampleStaff = await db.user.create({
    data: {
      name: "Vikram Mehta (Lead Counselor)",
      email: "staff_leads@admissionhere.in",
      phone: "+919876543213",
      phoneVerified: true,
      passwordHash: defaultPasswordHash,
      role: UserRole.STAFF,
      staffPermission: {
        create: {
          permissions: ["leads", "reviews"],
        },
      },
    },
  });

  const blogAuthor = await db.user.create({
    data: {
      name: "Sneha Mukherjee (Chief Education Editor)",
      email: "editor@admissionhere.in",
      phone: "+919876543211",
      phoneVerified: true,
      passwordHash: defaultPasswordHash,
      role: UserRole.AUTHOR,
    },
  });

  const studentUser = await db.user.create({
    data: {
      name: "Rohan Das",
      email: "student@example.com",
      phone: "+919876543212",
      phoneVerified: true,
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      targetStream: "Engineering",
      examScores: {
        jee_main_rank: 14200,
        category: "GEN",
        home_state: "Odisha",
      },
    },
  });

  console.log("👤 Created RBAC Users: SuperAdmin, Author, Student.");

  // 3. Create Entrance Exams Master
  const jeeMain = await db.exam.create({
    data: {
      slug: "jee-main",
      name: "Joint Entrance Examination (Main)",
      conductingBody: "National Testing Agency (NTA)",
      stream: "Engineering",
      examLevel: "National",
      applicationStart: new Date("2025-11-01"),
      applicationEnd: new Date("2025-12-04"),
      examDate: new Date("2026-01-22"),
      resultDate: new Date("2026-02-12"),
      overviewHtml: `
        <p>JEE Main is the premier national-level entrance exam for admission into undergraduate engineering programs at NITs, IIITs, CFTIs, and state-funded institutions.</p>
        <p>A score in the top 2.5 lakh candidates qualifies the student for JEE Advanced.</p>
      `,
      syllabusHtml: `
        <h3>Physics, Chemistry & Mathematics</h3>
        <p>Covers NCERT Class 11 and 12 curricula with an emphasis on conceptual clarity, problem-solving speed, and numerical accuracy.</p>
      `,
      patternJson: {
        totalMarks: 300,
        questions: 75,
        markingScheme: "+4 for correct, -1 for incorrect",
        mode: "Computer-Based Test (CBT)",
      },
    },
  });

  const neetUg = await db.exam.create({
    data: {
      slug: "neet-ug",
      name: "National Eligibility cum Entrance Test (UG)",
      conductingBody: "National Testing Agency (NTA)",
      stream: "Medical",
      examLevel: "National",
      applicationStart: new Date("2026-02-05"),
      applicationEnd: new Date("2026-03-10"),
      examDate: new Date("2026-05-03"),
      resultDate: new Date("2026-06-14"),
      overviewHtml: `
        <p>NEET UG is the singular mandatory entrance examination for MBBS, BDS, and AYUSH admissions across all government and private medical institutions in India.</p>
      `,
      syllabusHtml: `
        <h3>Biology (Botany & Zoology), Physics, Chemistry</h3>
        <p>Aligned strictly with the National Medical Commission (NMC) updated syllabus.</p>
      `,
      patternJson: {
        totalMarks: 720,
        questions: 180,
        markingScheme: "+4 for correct, -1 for incorrect",
        mode: "Pen & Paper (OMR)",
      },
    },
  });

  const catExam = await db.exam.create({
    data: {
      slug: "cat",
      name: "Common Admission Test",
      conductingBody: "Indian Institutes of Management (IIMs)",
      stream: "Management",
      examLevel: "National",
      applicationStart: new Date("2026-08-01"),
      applicationEnd: new Date("2026-09-20"),
      examDate: new Date("2026-11-29"),
      resultDate: new Date("2026-12-20"),
      overviewHtml: `
        <p>CAT is the flagship management aptitude test for admissions into 21 IIMs and over 1,000 top business schools across India including FMS, SPJIMR, and MDI.</p>
      `,
      syllabusHtml: `
        <h3>Sections: VARC, DILR, Quantitative Aptitude</h3>
      `,
      patternJson: {
        durationMinutes: 120,
        questions: 66,
        mode: "Computer-Based Test",
      },
    },
  });

  console.log("📝 Seeded Exams: JEE Main, NEET UG, CAT.");

  // 4. Create Standard Courses
  const btech = await db.course.create({
    data: {
      slug: "b-tech",
      stream: "Engineering",
      degree: "B.Tech",
      fullName: "Bachelor of Technology",
      durationYrs: 4,
      level: "UG",
    },
  });

  const mba = await db.course.create({
    data: {
      slug: "mba",
      stream: "Management",
      degree: "MBA",
      fullName: "Master of Business Administration",
      durationYrs: 2,
      level: "PG",
    },
  });

  const mbbs = await db.course.create({
    data: {
      slug: "mbbs",
      stream: "Medical",
      degree: "MBBS",
      fullName: "Bachelor of Medicine, Bachelor of Surgery",
      durationYrs: 5.5,
      level: "UG",
    },
  });

  const mtech = await db.course.create({
    data: {
      slug: "m-tech",
      stream: "Engineering",
      degree: "M.Tech",
      fullName: "Master of Technology",
      durationYrs: 2,
      level: "PG",
    },
  });

  const bba = await db.course.create({
    data: {
      slug: "bba",
      stream: "Management",
      degree: "BBA",
      fullName: "Bachelor of Business Administration",
      durationYrs: 3,
      level: "UG",
    },
  });

  const bca = await db.course.create({
    data: {
      slug: "bca",
      stream: "Computer Applications",
      degree: "BCA",
      fullName: "Bachelor of Computer Applications",
      durationYrs: 3,
      level: "UG",
    },
  });

  const mca = await db.course.create({
    data: {
      slug: "mca",
      stream: "Computer Applications",
      degree: "MCA",
      fullName: "Master of Computer Applications",
      durationYrs: 2,
      level: "PG",
    },
  });

  const bsc = await db.course.create({
    data: {
      slug: "b-sc",
      stream: "Science",
      degree: "B.Sc",
      fullName: "Bachelor of Science",
      durationYrs: 3,
      level: "UG",
    },
  });

  console.log("🎓 Seeded Core Degree Courses.");

  // 5. Create Colleges with Rich Data
  const iitBombay = await db.college.create({
    data: {
      slug: "iit-bombay",
      name: "Indian Institute of Technology Bombay",
      shortName: "IIT Bombay",
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&h=160&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop&q=80",
      brochurePdfUrl: "https://example.com/brochures/iit-bombay-2026.pdf",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
      latitude: 19.1334,
      longitude: 72.9133,
      estYear: 1958,
      ownershipType: OwnershipType.PUBLIC_GOVERNMENT,
      affiliatedTo: "Autonomous (Institute of National Importance)",
      approvedBy: ["AICTE", "UGC", "MoE"],
      naacGrade: "A++",
      nirfRank: 3,
      campusAreaAcres: 550,
      overviewHtml: `
        <p>Indian Institute of Technology Bombay is recognized worldwide as a leader in engineering education and research. Established in 1958 with assistance from UNESCO, it has evolved into a premier destination for students pursuing frontier technologies.</p>
        <p>IIT Bombay offers cutting-edge labs, an entrepreneurial incubation hub (SINE), and historic student festivals including Mood Indigo and Techfest.</p>
      `,
      admissionHtml: `
        <p>Admissions to the undergraduate B.Tech programs are conducted strictly through JoSAA counseling based on JEE Advanced ranks. Candidates must first clear JEE Main in the top 2.5 lakh cohort.</p>
      `,
      facilitiesJson: ["High-speed Campus Wi-Fi", "Olympic-size Swimming Pool", "Incubation Center (SINE)", "Central Library with 5M+ volumes", "Student Hostels (18 halls)"],
      galleryUrls: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&fit=crop",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop",
      ],
      faqsJson: [
        {
          question: "What is the cutoff for CSE at IIT Bombay?",
          answer: "Historically, the opening and closing rank for B.Tech Computer Science & Engineering at IIT Bombay for General category falls within AIR 1 to 68 in JEE Advanced.",
        },
        {
          question: "What is the average package for IIT Bombay placements?",
          answer: "For the latest passing batch, the overall average CTC was ₹23.5 LPA, with the top domestic offer surpassing ₹1.68 Crore per annum.",
        },
      ],
      ratingOverall: 4.9,
      reviewCount: 342,
      isFeatured: true,
      isPublished: true,
    },
  });

  const nitRourkela = await db.college.create({
    data: {
      slug: "nit-rourkela",
      name: "National Institute of Technology Rourkela",
      shortName: "NIT Rourkela",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&h=160&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&h=600&fit=crop&q=80",
      brochurePdfUrl: "https://example.com/brochures/nit-rourkela-2026.pdf",
      city: "Rourkela",
      state: "Odisha",
      pincode: "769008",
      latitude: 22.2533,
      longitude: 84.9011,
      estYear: 1961,
      ownershipType: OwnershipType.PUBLIC_GOVERNMENT,
      affiliatedTo: "Autonomous (NIT Council, MoE)",
      approvedBy: ["AICTE", "UGC", "NBA"],
      naacGrade: "A+",
      nirfRank: 16,
      campusAreaAcres: 647,
      overviewHtml: `
        <p>NIT Rourkela is one of India's premier technical institutions, known for stellar research output, an sprawling 647-acre campus, and exceptional academic rigor in core engineering disciplines.</p>
      `,
      admissionHtml: `
        <p>B.Tech admissions are based on JEE Main scores through centralized CSAB/JoSAA counseling. 50% seats are reserved for Home State (Odisha) candidates, and 50% for Other States.</p>
      `,
      facilitiesJson: ["TIIR Innovation Center", "Supercomputing Cluster", "Modern Hostels", "Indoor Badminton & Sports Arena"],
      galleryUrls: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fit=crop",
      ],
      faqsJson: [
        {
          question: "Is there a Home State quota in NIT Rourkela?",
          answer: "Yes, 50% of the seats across all B.Tech branches are reserved for candidates having their domicile or 12th passing certificate from Odisha (HS Quota).",
        },
      ],
      ratingOverall: 4.7,
      reviewCount: 280,
      isFeatured: true,
      isPublished: true,
    },
  });

  const iitBbsr = await db.college.create({
    data: {
      slug: "iit-bhubaneswar",
      name: "Indian Institute of Technology Bhubaneswar",
      shortName: "IIT Bhubaneswar",
      logoUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=160&h=160&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=600&fit=crop&q=80",
      brochurePdfUrl: "https://example.com/brochures/iit-bbsr-2026.pdf",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "752050",
      latitude: 20.1485,
      longitude: 85.6713,
      estYear: 2008,
      ownershipType: OwnershipType.PUBLIC_GOVERNMENT,
      affiliatedTo: "Autonomous (MoE)",
      approvedBy: ["AICTE", "UGC"],
      naacGrade: "A",
      nirfRank: 47,
      campusAreaAcres: 936,
      overviewHtml: `
        <p>IIT Bhubaneswar is one of the fastest-growing second-generation IITs, located at the foot of the historic Barunei Hill with state-of-the-art research centers in Climate Sciences, Minerals, and Artificial Intelligence.</p>
      `,
      facilitiesJson: ["Green Sustainable Campus", "High Performance Computing Lab", "Student Activity Center", "Hostel Wi-Fi"],
      galleryUrls: [],
      faqsJson: [],
      ratingOverall: 4.5,
      reviewCount: 110,
      isFeatured: false,
      isPublished: true,
    },
  });

  const bitsPilani = await db.college.create({
    data: {
      slug: "bits-pilani",
      name: "Birla Institute of Technology and Science, Pilani",
      shortName: "BITS Pilani",
      logoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=160&h=160&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=1200&h=600&fit=crop&q=80",
      brochurePdfUrl: "https://example.com/brochures/bits-pilani-2026.pdf",
      city: "Pilani",
      state: "Rajasthan",
      pincode: "333031",
      estYear: 1964,
      ownershipType: OwnershipType.DEEMED,
      affiliatedTo: "Deemed to be University (Institute of Eminence)",
      approvedBy: ["UGC", "NAAC"],
      naacGrade: "A++",
      nirfRank: 20,
      campusAreaAcres: 328,
      overviewHtml: `
        <p>BITS Pilani is India's highest-ranked private engineering and science institution, famous for its zero-attendance policy, Practice School industrial internship system, and robust alumni founders network.</p>
      `,
      admissionHtml: `
        <p>Admissions are conducted strictly via the BITSAT entrance examination with no reservation quotas.</p>
      `,
      facilitiesJson: ["Practice School Network", "Student Union Gym", "Robotics Club", "Incubation Hub"],
      galleryUrls: [],
      ratingOverall: 4.8,
      reviewCount: 310,
      isFeatured: true,
      isPublished: true,
    },
  });

  const iimAhmedabad = await db.college.create({
    data: {
      slug: "iim-ahmedabad",
      name: "Indian Institute of Management Ahmedabad",
      shortName: "IIM Ahmedabad",
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&h=160&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=600&fit=crop&q=80",
      brochurePdfUrl: "https://example.com/brochures/iima-2026.pdf",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
      estYear: 1961,
      ownershipType: OwnershipType.PUBLIC_GOVERNMENT,
      affiliatedTo: "Autonomous (IIM Act)",
      approvedBy: ["EQUIS", "MoE"],
      nirfRank: 1,
      campusAreaAcres: 102,
      overviewHtml: `
        <p>Consistently ranked #1 in India for management education, IIMA is internationally renowned for its Louis Kahn heritage campus and rigorous Harvard-style case study pedagogy.</p>
      `,
      facilitiesJson: ["Vikram Sarabhai Library", "Heritage Red Brick Quad", "Case Study Lecture Halls"],
      ratingOverall: 4.9,
      reviewCount: 190,
      isFeatured: true,
      isPublished: true,
    },
  });

  console.log("🏛️ Seeded Colleges: IIT Bombay, NIT Rourkela, IIT Bhubaneswar, BITS Pilani, IIM Ahmedabad.");

  // 6. Create College Course Offerings
  const iitbCse = await db.collegeCourse.create({
    data: {
      collegeId: iitBombay.id,
      courseId: btech.id,
      specialization: "Computer Science & Engineering",
      totalFeesInr: 1050000,
      firstYearFeesInr: 265000,
      hostelFeesYearlyInr: 45000,
      intakeSeats: 171,
      acceptedExamSlugs: ["jee-main", "jee-advanced"],
      eligibilityCriteria: {
        min_12th_pct: 75,
        mandatory_subjects: ["Physics", "Mathematics", "Chemistry"],
      },
    },
  });

  const nitrCse = await db.collegeCourse.create({
    data: {
      collegeId: nitRourkela.id,
      courseId: btech.id,
      specialization: "Computer Science & Engineering",
      totalFeesInr: 720000,
      firstYearFeesInr: 185000,
      hostelFeesYearlyInr: 40000,
      intakeSeats: 120,
      acceptedExamSlugs: ["jee-main"],
      eligibilityCriteria: {
        min_12th_pct: 75,
        mandatory_subjects: ["Physics", "Mathematics"],
      },
    },
  });

  const nitrMech = await db.collegeCourse.create({
    data: {
      collegeId: nitRourkela.id,
      courseId: btech.id,
      specialization: "Mechanical Engineering",
      totalFeesInr: 680000,
      firstYearFeesInr: 175000,
      hostelFeesYearlyInr: 40000,
      intakeSeats: 110,
      acceptedExamSlugs: ["jee-main"],
      eligibilityCriteria: {
        min_12th_pct: 75,
        mandatory_subjects: ["Physics", "Mathematics"],
      },
    },
  });

  const bitsCse = await db.collegeCourse.create({
    data: {
      collegeId: bitsPilani.id,
      courseId: btech.id,
      specialization: "Computer Science",
      totalFeesInr: 2380000,
      firstYearFeesInr: 610000,
      hostelFeesYearlyInr: 65000,
      intakeSeats: 210,
      acceptedExamSlugs: ["bitsat"],
      eligibilityCriteria: {
        min_12th_pct: 75,
        aggregate_pcm: 75,
      },
    },
  });

  const iimaPgp = await db.collegeCourse.create({
    data: {
      collegeId: iimAhmedabad.id,
      courseId: mba.id,
      specialization: "Post Graduate Programme in Management (PGP)",
      totalFeesInr: 2500000,
      firstYearFeesInr: 1300000,
      intakeSeats: 395,
      acceptedExamSlugs: ["cat"],
      eligibilityCriteria: {
        min_grad_pct: 50,
      },
    },
  });

  const iitbMtech = await db.collegeCourse.create({
    data: {
      collegeId: iitBombay.id,
      courseId: mtech.id,
      specialization: "Artificial Intelligence & Data Science",
      totalFeesInr: 450000,
      firstYearFeesInr: 230000,
      hostelFeesYearlyInr: 45000,
      intakeSeats: 60,
      acceptedExamSlugs: ["gate"],
      eligibilityCriteria: {
        min_btech_pct: 65,
      },
    },
  });

  const nitrMca = await db.collegeCourse.create({
    data: {
      collegeId: nitRourkela.id,
      courseId: mca.id,
      specialization: "Master of Computer Applications",
      totalFeesInr: 380000,
      firstYearFeesInr: 195000,
      hostelFeesYearlyInr: 40000,
      intakeSeats: 50,
      acceptedExamSlugs: ["nimcet"],
      eligibilityCriteria: {
        min_grad_pct: 60,
      },
    },
  });

  console.log("📚 Seeded Course Offerings with Fees and Seat Intakes.");

  // 7. Seed Exam Cutoffs
  await db.examCutoff.createMany({
    data: [
      {
        examId: jeeMain.id,
        collegeCourseId: nitrCse.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "GEN",
        quota: "HS",
        openingRank: 1250,
        closingRank: 6420,
      },
      {
        examId: jeeMain.id,
        collegeCourseId: nitrCse.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "GEN",
        quota: "OS",
        openingRank: 850,
        closingRank: 3410,
      },
      {
        examId: jeeMain.id,
        collegeCourseId: nitrCse.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "OBC",
        quota: "HS",
        openingRank: 4200,
        closingRank: 12500,
      },
      {
        examId: jeeMain.id,
        collegeCourseId: nitrMech.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "GEN",
        quota: "HS",
        openingRank: 12000,
        closingRank: 26800,
      },
      {
        examId: jeeMain.id,
        collegeCourseId: nitrMech.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "GEN",
        quota: "OS",
        openingRank: 8900,
        closingRank: 18500,
      },
      {
        examId: catExam.id,
        collegeCourseId: iimaPgp.id,
        academicYear: 2025,
        counselingRound: 1,
        category: "GEN",
        quota: "AI",
        cutoffPercentile: 99.6,
      },
    ],
  });

  console.log("🎯 Seeded Historical Exam Cutoffs.");

  // 8. Seed Placement Stats
  await db.placementStat.create({
    data: {
      collegeId: iitBombay.id,
      batchYear: 2025,
      highestPackageInr: BigInt(16800000),
      averagePackageInr: BigInt(2350000),
      medianPackageInr: BigInt(1900000),
      placementPercentage: 96.8,
      totalOffers: 1475,
      topRecruiters: ["Google", "Microsoft", "Jane Street", "Apple", "Qualcomm", "Rubrik"],
    },
  });

  await db.placementStat.create({
    data: {
      collegeId: nitRourkela.id,
      batchYear: 2025,
      highestPackageInr: BigInt(8300000),
      averagePackageInr: BigInt(1420000),
      medianPackageInr: BigInt(1100000),
      placementPercentage: 91.5,
      totalOffers: 1320,
      topRecruiters: ["Amazon", "Oracle", "Texas Instruments", "Tata Steel", "Schlumberger"],
    },
  });

  await db.placementStat.create({
    data: {
      collegeId: bitsPilani.id,
      batchYear: 2025,
      highestPackageInr: BigInt(13300000),
      averagePackageInr: BigInt(2080000),
      medianPackageInr: BigInt(1700000),
      placementPercentage: 94.2,
      totalOffers: 1850,
      topRecruiters: ["Uber", "Directi", "Goldman Sachs", "McKinsey", "Adobe"],
    },
  });

  console.log("💼 Seeded Official Placement Records.");

  // 9. Seed Agency Rankings
  await db.agencyRanking.createMany({
    data: [
      {
        collegeId: iitBombay.id,
        agencyName: "NIRF",
        category: "Engineering",
        rankingYear: 2025,
        rankNumber: 3,
        outOfTotal: 200,
      },
      {
        collegeId: nitRourkela.id,
        agencyName: "NIRF",
        category: "Engineering",
        rankingYear: 2025,
        rankNumber: 16,
        outOfTotal: 200,
      },
      {
        collegeId: bitsPilani.id,
        agencyName: "NIRF",
        category: "Engineering",
        rankingYear: 2025,
        rankNumber: 20,
        outOfTotal: 200,
      },
      {
        collegeId: iimAhmedabad.id,
        agencyName: "NIRF",
        category: "Management",
        rankingYear: 2025,
        rankNumber: 1,
        outOfTotal: 100,
      },
    ],
  });

  console.log("🏆 Seeded NIRF Agency Rankings.");

  // 10. Seed Student Reviews
  await db.review.create({
    data: {
      collegeId: nitRourkela.id,
      userId: studentUser.id,
      courseName: "B.Tech Computer Science & Engineering",
      batchYear: 2025,
      ratingOverall: 4.8,
      ratingPlacements: 4.9,
      ratingInfra: 4.7,
      ratingFaculty: 4.5,
      ratingValueRoi: 5.0,
      title: "Phenomenal campus life with unmatched ROI and core industry exposure",
      prosText: "The coding culture is incredible. High-speed LAN in every hostel room, dedicated tech clubs like Cyborg and GDSC, and top product companies visit with strong CTC packages.",
      consText: "Summer months in Rourkela can get quite warm. Academic timetable can be hectic during midterms.",
      isVerified: true,
      moderationStatus: "APPROVED",
    },
  });

  console.log("⭐ Seeded Verified Reviews.");

  // 11. Seed Editorial Blog Posts (SEO & GEO Optimized)
  const blogPost1 = await db.blogPost.create({
    data: {
      slug: "jee-main-2026-cutoff-analysis-for-top-nits",
      title: "JEE Main 2026 Cutoff Analysis: Opening and Closing Ranks for Top NITs",
      metaTitle: "JEE Main 2026 Cutoff for Top NITs: Branch-Wise Ranks, Category & Quotas",
      metaDescription: "Check comprehensive branch-wise opening and closing ranks for NIT Trichy, NIT Surathkal, and NIT Rourkela. Complete JoSAA round-1 to 6 breakdown.",
      tldrSummary: [
        "Top NITs CSE closing ranks for General category typically range between 1,000 to 7,000 AIR.",
        "Home State (HS) quota provides a 40-60% rank relaxation compared to Other State (OS) candidates.",
        "NIT Rourkela CSE closed at 6,420 for HS candidates and 3,410 for OS candidates in Round 1.",
        "Core branches (Mechanical, Civil, Chemical) remain available up to 35,000+ rank in subsequent rounds.",
      ],
      contentMdx: `
# JEE Main 2026 Cutoff Trends for National Institutes of Technology

The Joint Seat Allocation Authority (JoSAA) has concluded the initial rounds of seat allotment. Here is our detailed editorial breakdown of closing ranks, home state relaxations, and strategy tips for engineering aspirants.

<BlogTldrBox />

## 1. Top 5 NITs CSE Cutoff Comparison
Students scoring between 99.2 to 99.9 percentile have high probability of securing Computer Science and Engineering in Tier-1 NITs.

<EmbeddedCollegeCTA slug="nit-rourkela" />

### Why NIT Rourkela is a Top Contender
With a lush 647-acre campus, NIRF Rank 16, and an average package exceeding ₹14.2 LPA, NIT Rourkela remains one of the most sought-after institutes in eastern India.

## Frequently Asked Questions
Review the official JoSAA counseling dates before finalizing your mock choices.
      `,
      category: BlogCategory.CUTOFF_ANALYSIS,
      tags: ["JEE Main", "JoSAA Counseling", "NIT Cutoffs", "B.Tech Admissions"],
      status: PostStatus.PUBLISHED,
      isLiveBlog: false,
      faqsJson: [
        {
          question: "What rank is required for CSE in NIT Rourkela?",
          answer: "Under Home State quota, General category students generally require an AIR below 7,000. For Other State students, it closes around 3,500.",
        },
        {
          question: "Can I get an NIT with a 25,000 rank in JEE Main?",
          answer: "Yes, candidates with a rank around 25,000 can comfortably secure branches like Mechanical, Electrical, Chemical, or Civil at established NITs.",
        },
      ],
      authorId: blogAuthor.id,
      relatedCollegeId: nitRourkela.id,
      relatedExamId: jeeMain.id,
      viewCount: 1420,
      publishedAt: new Date(),
    },
  });

  const blogPost2 = await db.blogPost.create({
    data: {
      slug: "live-jee-main-2026-session-1-results-updates",
      title: "LIVE: JEE Main 2026 Session 1 Scorecards Released, Cutoff Percentiles & Toppers List",
      metaTitle: "Live JEE Main 2026 Result Updates: Scorecard Link & Rank Predictor",
      metaDescription: "Live real-time coverage of NTA JEE Main Session 1 result announcement, scorecards download, topper marks, and qualifying cutoff percentiles.",
      tldrSummary: [
        "NTA has declared the JEE Main 2026 Session 1 results on jeemain.nta.ac.in.",
        "Over 12.3 lakh unique aspirants registered for Session 1 nationwide.",
        "Expected qualifying cutoff for JEE Advanced is projected at 91.2 percentile for General category.",
        "Session 2 registration window remains open until March 5, 2026.",
      ],
      contentMdx: `
# Live Exam Updates: JEE Main 2026 Session 1

Stay tuned for real-time score updates, cutoff shifts, and direct college predictor links.

<LiveBlogTicker />

<EmbeddedCollegeCTA slug="iit-bombay" />
      `,
      category: BlogCategory.EXAM_NEWS,
      tags: ["JEE Main", "NTA Results", "Live Updates"],
      status: PostStatus.PUBLISHED,
      isLiveBlog: true,
      liveUpdatesJson: [
        {
          id: "up-3",
          timestamp: "2026-02-12T11:45:00Z",
          headline: "NTA Activates Final Answer Key & Scorecard Download Server 2",
          bodyHtml: "<p>Candidates experiencing high latency on Server 1 can now retrieve their NTA percentile scores via Mirror Server 2 using Application Number and Date of Birth.</p>",
          isPinned: true,
        },
        {
          id: "up-2",
          timestamp: "2026-02-12T10:15:00Z",
          headline: "Cutoff Analysis: General Category Cutoff Estimated at 91.2 Percentile",
          bodyHtml: "<p>Experts analyze that heightened competition has slightly pushed the minimum qualifying percentile for JEE Advanced.</p>",
          isPinned: false,
        },
        {
          id: "up-1",
          timestamp: "2026-02-12T09:00:00Z",
          headline: "Session 1 Results Officially Announced by NTA",
          bodyHtml: "<p>National Testing Agency has uploaded the final normalization tables and individual scorecards.</p>",
          isPinned: false,
        },
      ],
      authorId: blogAuthor.id,
      relatedExamId: jeeMain.id,
      viewCount: 5280,
      publishedAt: new Date(),
    },
  });

  console.log("📰 Seeded SEO Editorial & Live Blog Posts.");

  // 12. Seed Lead Capture & Attribution Records
  await db.lead.createMany({
    data: [
      {
        userId: studentUser.id,
        studentName: "Rohan Das",
        phone: "+919876543212",
        email: "student@example.com",
        city: "Bhubaneswar",
        state: "Odisha",
        targetStream: "Engineering",
        targetDegree: "B.Tech",
        examRankInfo: "JEE Main AIR: 14200",
        targetCollegeId: nitRourkela.id,
        sourceBlogId: blogPost1.id,
        sourceUrl: "/blog/jee-main-2026-cutoff-analysis-for-top-nits",
        ctaType: LeadCtaType.DOWNLOAD_BROCHURE,
        utmSource: "google",
        utmMedium: "organic_search",
        utmCampaign: "jee_cutoff_2026",
        status: LeadStatus.ASSIGNED_TO_COUNSELOR,
        counselorNotes: "Candidate is targeting B.Tech Mechanical or Electrical at NIT Rourkela with HS Quota.",
      },
      {
        studentName: "Ananya Sen",
        phone: "+919811223344",
        email: "ananya.sen@example.com",
        city: "Kolkata",
        state: "West Bengal",
        targetStream: "Management",
        targetDegree: "MBA",
        examRankInfo: "CAT 99.4 percentile",
        targetCollegeId: iimAhmedabad.id,
        sourceUrl: "/college/iim-ahmedabad",
        ctaType: LeadCtaType.APPLY_NOW,
        utmSource: "counselor_rag",
        utmMedium: "ai_chat",
        status: LeadStatus.OTP_VERIFIED,
      },
    ],
  });

  console.log("🎯 Seeded B2B Student Leads with Full Attribution.");
  console.log("✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

