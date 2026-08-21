import logging
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.school import School
from app.models.user import User
from app.models.hr import (
    Employee,
    AttendanceRecord,
    LeaveRequest,
    LeaveBalance,
    PayrollPeriod,
    Payslip,
    JobPosting,
    Candidate,
    DocumentRecord,
    PerformanceReview,
    GoalOKR,
    ExitCase,
    EngagementKudos,
)

logger = logging.getLogger("ofc360.seed")


async def seed_database(db: AsyncSession):
    try:
        # Check if company/school exists
        school = (await db.execute(select(School).limit(1))).scalar_one_or_none()
        if not school:
            school = School(
                id="c0000000-0000-0000-0000-000000000001",
                school_code="OFC-DEMO",
                school_name="EquinoxSphere OFC360 Enterprise",
                status="active",
            )
            db.add(school)
            await db.flush()
            logger.info("Created default enterprise tenant: %s", school.school_name)

        tenant_id = school.id

        # Check default admin user
        admin_user = (await db.execute(select(User).where(User.email == "admin@ofc360.com"))).scalar_one_or_none()
        if not admin_user:
            admin_user = User(
                id="u0000000-0000-0000-0000-000000000001",
                tenant_id=tenant_id,
                school_id=tenant_id,
                name="Alex Vance",
                email="admin@ofc360.com",
                password_hash=hash_password("Admin@12345"),
                role="admin",
                status="active",
                phone="+1 (555) 019-2834",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            )
            db.add(admin_user)
            await db.flush()

        # Check if employees exist
        existing_emp = (await db.execute(select(Employee).where(Employee.tenant_id == tenant_id).limit(1))).scalar_one_or_none()
        if not existing_emp:
            employees_data = [
                {
                    "first_name": "Sophia",
                    "last_name": "Chen",
                    "name": "Sophia Chen",
                    "email": "sophia.chen@ofc360.com",
                    "personal_email": "sophia.chen.dev@gmail.com",
                    "company_email": "sophia.chen@ofc360.com",
                    "phone": "+1 (555) 234-5678",
                    "department": "Engineering",
                    "designation": "Principal Software Architect",
                    "role": "manager",
                    "system_role": "manager",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2023, 3, 15),
                    "salary": 145000.0,
                    "ctc": 145000.0,
                    "location": "San Francisco, CA",
                    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Marcus",
                    "last_name": "Sterling",
                    "name": "Marcus Sterling",
                    "email": "marcus.sterling@ofc360.com",
                    "personal_email": "marcus.sterling@gmail.com",
                    "company_email": "marcus.sterling@ofc360.com",
                    "phone": "+1 (555) 345-6789",
                    "department": "Product",
                    "designation": "VP of Product Strategy",
                    "role": "manager",
                    "system_role": "manager",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2022, 8, 1),
                    "salary": 160000.0,
                    "ctc": 160000.0,
                    "location": "New York, NY",
                    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Aarav",
                    "last_name": "Patel",
                    "name": "Aarav Patel",
                    "email": "aarav.patel@ofc360.com",
                    "personal_email": "aarav.patel99@gmail.com",
                    "company_email": "aarav.patel@ofc360.com",
                    "phone": "+1 (555) 456-7890",
                    "department": "Engineering",
                    "designation": "Senior Full-Stack Engineer",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2024, 1, 10),
                    "salary": 115000.0,
                    "ctc": 115000.0,
                    "location": "Austin, TX",
                    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Elena",
                    "last_name": "Rostova",
                    "name": "Elena Rostova",
                    "email": "elena.rostova@ofc360.com",
                    "personal_email": "elena.rostova@outlook.com",
                    "company_email": "elena.rostova@ofc360.com",
                    "phone": "+1 (555) 567-8901",
                    "department": "Human Resources",
                    "designation": "Director of People Operations",
                    "role": "hr",
                    "system_role": "hr",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2023, 6, 20),
                    "salary": 125000.0,
                    "ctc": 125000.0,
                    "location": "Chicago, IL",
                    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "David",
                    "last_name": "Kim",
                    "name": "David Kim",
                    "email": "david.kim@ofc360.com",
                    "personal_email": "dkim.design@gmail.com",
                    "company_email": "david.kim@ofc360.com",
                    "phone": "+1 (555) 678-9012",
                    "department": "Design",
                    "designation": "Lead UI/UX Designer",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2024, 4, 5),
                    "salary": 105000.0,
                    "ctc": 105000.0,
                    "location": "Seattle, WA",
                    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Zoe",
                    "last_name": "Kowalski",
                    "name": "Zoe Kowalski",
                    "email": "zoe.kowalski@ofc360.com",
                    "personal_email": "zoe.k@gmail.com",
                    "company_email": "zoe.kowalski@ofc360.com",
                    "phone": "+1 (555) 789-0123",
                    "department": "Marketing",
                    "designation": "Growth Marketing Lead",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2024, 7, 15),
                    "salary": 98000.0,
                    "ctc": 98000.0,
                    "location": "New York, NY",
                    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Liam",
                    "last_name": "O'Connor",
                    "name": "Liam O'Connor",
                    "email": "liam.oconnor@ofc360.com",
                    "personal_email": "liam.oc@gmail.com",
                    "company_email": "liam.oconnor@ofc360.com",
                    "phone": "+1 (555) 890-1234",
                    "department": "Sales",
                    "designation": "Enterprise Account Executive",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2023, 11, 1),
                    "salary": 110000.0,
                    "ctc": 110000.0,
                    "location": "Boston, MA",
                    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Priya",
                    "last_name": "Sharma",
                    "name": "Priya Sharma",
                    "email": "priya.sharma@ofc360.com",
                    "personal_email": "priya.sharma@gmail.com",
                    "company_email": "priya.sharma@ofc360.com",
                    "phone": "+1 (555) 901-2345",
                    "department": "Engineering",
                    "designation": "DevOps & Cloud Engineer",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Active",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2024, 2, 20),
                    "salary": 120000.0,
                    "ctc": 120000.0,
                    "location": "Austin, TX",
                    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                },
                {
                    "first_name": "Julian",
                    "last_name": "Santos",
                    "name": "Julian Santos",
                    "email": "julian.santos@ofc360.com",
                    "personal_email": "julian.santos@gmail.com",
                    "company_email": "julian.santos@ofc360.com",
                    "phone": "+1 (555) 012-3456",
                    "department": "Operations",
                    "designation": "Compliance & Security Officer",
                    "role": "employee",
                    "system_role": "employee",
                    "status": "Probation",
                    "employment_type": "FULL_TIME",
                    "joining_date": date(2026, 1, 15),
                    "salary": 92000.0,
                    "ctc": 92000.0,
                    "location": "San Francisco, CA",
                    "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
                },
            ]

            created_employees = []
            for emp_info in employees_data:
                emp = Employee(
                    tenant_id=tenant_id,
                    first_name=emp_info["first_name"],
                    last_name=emp_info["last_name"],
                    name=emp_info["name"],
                    email=emp_info["email"],
                    personal_email=emp_info["personal_email"],
                    company_email=emp_info["company_email"],
                    phone=emp_info["phone"],
                    department=emp_info["department"],
                    designation=emp_info["designation"],
                    role=emp_info["role"],
                    system_role=emp_info["system_role"],
                    status=emp_info["status"],
                    employment_type=emp_info["employment_type"],
                    joining_date=emp_info["joining_date"],
                    joined_at=emp_info["joining_date"].isoformat(),
                    salary=emp_info["salary"],
                    ctc=emp_info["ctc"],
                    location=emp_info["location"],
                    avatar=emp_info["avatar"],
                )
                db.add(emp)
                created_employees.append(emp)

            await db.flush()

            # Seed Attendance Records for the last 5 days
            today = date.today()
            for i in range(5):
                att_date = today - timedelta(days=i)
                for idx, emp in enumerate(created_employees):
                    status = "present"
                    check_in = "09:05 AM"
                    check_out = "06:15 PM"
                    if idx == 3 and i == 0:
                        status = "on_leave"
                        check_in = None
                        check_out = None
                    elif idx == 5 and i == 1:
                        status = "late"
                        check_in = "10:15 AM"

                    rec = AttendanceRecord(
                        tenant_id=tenant_id,
                        employee_id=emp.id,
                        date=att_date,
                        check_in=check_in,
                        check_out=check_out,
                        status=status,
                        location="Office Headquarters, San Francisco",
                        verification_method="face_id" if idx % 2 == 0 else "gps",
                        latitude=37.7749,
                        longitude=-122.4194,
                    )
                    db.add(rec)

            # Seed Leave Balances & Requests
            for emp in created_employees:
                for l_type in ["Casual Leave", "Sick Leave", "Annual Leave"]:
                    db.add(LeaveBalance(
                        tenant_id=tenant_id,
                        employee_id=emp.id,
                        leave_type=l_type,
                        total=12.0 if l_type != "Annual Leave" else 18.0,
                        used=2.0,
                        remaining=10.0 if l_type != "Annual Leave" else 16.0,
                    ))

            # Add sample leave request
            if created_employees:
                db.add(LeaveRequest(
                    tenant_id=tenant_id,
                    employee_id=created_employees[3].id,
                    employee_name=created_employees[3].name,
                    leave_type="Sick Leave",
                    start_date=today,
                    end_date=today + timedelta(days=1),
                    days=2.0,
                    reason="Doctor scheduled checkup & recovery",
                    status="approved",
                    applied_at=today.isoformat(),
                    reviewed_at=today.isoformat(),
                    reviewed_by="Alex Vance",
                    review_comments="Approved. Take care!",
                ))

            # Seed Payroll Periods & Payslips
            p1 = PayrollPeriod(
                tenant_id=tenant_id,
                name="March 2026",
                month=3,
                year=2026,
                start_date=date(2026, 3, 1),
                end_date=date(2026, 3, 31),
                pay_date=date(2026, 3, 31),
                status="COMPLETED",
                total_gross=sum(e.salary / 12 for e in created_employees),
                total_net=sum((e.salary / 12) * 0.82 for e in created_employees),
                total_deductions=sum((e.salary / 12) * 0.18 for e in created_employees),
                employee_count=len(created_employees),
            )
            db.add(p1)
            await db.flush()

            for emp in created_employees:
                gross = round(emp.salary / 12, 2)
                basic = round(gross * 0.5, 2)
                hra = round(gross * 0.3, 2)
                allowance = round(gross * 0.2, 2)
                pf = round(basic * 0.12, 2)
                tax = round(gross * 0.1, 2)
                deductions = pf + tax
                net = gross - deductions
                db.add(Payslip(
                    tenant_id=tenant_id,
                    employee_id=emp.id,
                    period_id=p1.id,
                    employee_name=emp.name,
                    department=emp.department,
                    designation=emp.designation,
                    basic_salary=basic,
                    hra=hra,
                    special_allowances=allowance,
                    gross_salary=gross,
                    pf=pf,
                    esi=0.0,
                    tax=tax,
                    total_deductions=deductions,
                    net_salary=net,
                    status="PAID",
                    generated_at=date(2026, 3, 31).isoformat(),
                ))

            # Seed Job Postings & Candidates
            job1 = JobPosting(
                tenant_id=tenant_id,
                title="Senior React & TypeScript Engineer",
                slug="senior-react-typescript-engineer",
                department="Engineering",
                designation="Senior Frontend Engineer",
                location="Remote (US / Europe)",
                employment_type="Full-Time",
                min_experience=4,
                max_experience=8,
                min_salary=110000.0,
                max_salary=140000.0,
                vacancies=2,
                job_description="We are seeking an experienced Senior React & TypeScript engineer to scale our AI-driven workforce intelligence platform.",
                requirements="4+ years React, TypeScript, Redux Toolkit, TailwindCSS, REST/GraphQL APIs",
                status="Active",
            )
            job2 = JobPosting(
                tenant_id=tenant_id,
                title="AI Copilot & ML Engineer",
                slug="ai-copilot-ml-engineer",
                department="Engineering",
                designation="Machine Learning Engineer",
                location="San Francisco, CA / Hybrid",
                employment_type="Full-Time",
                min_experience=3,
                max_experience=7,
                min_salary=130000.0,
                max_salary=165000.0,
                vacancies=1,
                job_description="Design and deploy LLM agents, vector search, and retrieval pipelines for enterprise HR analytics.",
                requirements="Python, FastAPI, PyTorch, LangChain, RAG architectures, Postgres",
                status="Active",
            )
            db.add_all([job1, job2])
            await db.flush()

            # Seed Candidates
            c1 = Candidate(
                tenant_id=tenant_id,
                job_id=job1.id,
                name="Ethan Reynolds",
                email="ethan.reynolds@example.com",
                phone="+1 (555) 712-9988",
                job_title="Senior React & TypeScript Engineer",
                stage="Interview",
                ats_score=94.5,
                experience_years=5.5,
                skills="React, TypeScript, Redux, Next.js, Jest, Vite",
                ai_summary="Strong candidate with high technical proficiency in state management and modular React architecture. Recommending final technical round.",
                source="LinkedIn Sourcing",
            )
            c2 = Candidate(
                tenant_id=tenant_id,
                job_id=job1.id,
                name="Samantha Wu",
                email="samantha.wu@example.com",
                phone="+1 (555) 823-1122",
                job_title="Senior React & TypeScript Engineer",
                stage="Screening",
                ats_score=88.0,
                experience_years=4.0,
                skills="React, JavaScript, CSS, HTML5, REST APIs",
                ai_summary="Solid foundation in modern web technologies with great communication skills.",
                source="Careers Portal",
            )
            db.add_all([c1, c2])

            # Seed Documents
            docs = [
                DocumentRecord(
                    tenant_id=tenant_id,
                    name="Master Full-Time Employment Agreement.pdf",
                    category="Contract",
                    type="pdf",
                    size="1.4 MB",
                    author="Legal & HR Operations",
                    status="Verified",
                ),
                DocumentRecord(
                    tenant_id=tenant_id,
                    name="OFC360 Enterprise Workplace & Leave Policy Handbook 2026.pdf",
                    category="Policy",
                    type="pdf",
                    size="2.8 MB",
                    author="People Team",
                    status="Active",
                ),
                DocumentRecord(
                    tenant_id=tenant_id,
                    name="Standard Mutual Non-Disclosure Agreement (NDA).pdf",
                    category="Contract",
                    type="pdf",
                    size="850 KB",
                    author="Legal Team",
                    status="Verified",
                ),
                DocumentRecord(
                    tenant_id=tenant_id,
                    name="Q1 FY26 SOC-2 & ISO27001 Security Compliance Log.pdf",
                    category="Report",
                    type="pdf",
                    size="4.2 MB",
                    author="Security & IT Audit",
                    status="Verified",
                ),
            ]
            db.add_all(docs)

            # Seed OKR Goals
            goals = [
                GoalOKR(
                    tenant_id=tenant_id,
                    title="Scale Global Engineering Hiring to 20 Engineers",
                    description="Expand frontend and backend infrastructure team capacity for Q2 delivery.",
                    category="Company",
                    progress=65,
                    target="20 Hires",
                    status="In Progress",
                    due_date="June 30, 2026",
                ),
                GoalOKR(
                    tenant_id=tenant_id,
                    title="Maintain 99.95% API SLA & Platform Uptime",
                    description="Continuous monitoring, automated failover, and sub-100ms API response latency.",
                    category="Department",
                    progress=92,
                    target="99.95%",
                    status="On Track",
                    due_date="December 31, 2026",
                ),
                GoalOKR(
                    tenant_id=tenant_id,
                    title="Enhance Employee Net Promoter Score (eNPS) to +65",
                    description="Implement monthly pulse surveys and career development roadmaps.",
                    category="Company",
                    progress=80,
                    target="+65 eNPS",
                    status="In Progress",
                    due_date="September 30, 2026",
                ),
            ]
            db.add_all(goals)

            # Seed Engagement Kudos
            kudos = [
                EngagementKudos(
                    tenant_id=tenant_id,
                    from_user="Marcus Sterling",
                    to_user="Sophia Chen",
                    message="Outstanding leadership during the Q1 core architecture refactoring! Incredible speed and clean execution.",
                    badge="Rockstar Architecture",
                    date="Yesterday",
                ),
                EngagementKudos(
                    tenant_id=tenant_id,
                    from_user="Elena Rostova",
                    to_user="Aarav Patel",
                    message="Thank you for mentoring the new onboarding cohort and driving positive developer culture!",
                    badge="Team Player",
                    date="2 days ago",
                ),
            ]
            db.add_all(kudos)

            logger.info("Successfully seeded database with complete OFC360 enterprise data.")

        await db.commit()
    except Exception as e:
        logger.exception("Error during database seeding: %s", str(e))
        await db.rollback()
