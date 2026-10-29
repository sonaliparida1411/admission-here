import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { generateFaqJsonLd } from "@/lib/seo/json-ld";
import { HelpCircle, ChevronDown } from "lucide-react";

export default async function CollegeQnaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
  });

  if (!college) notFound();

  const defaultFaqs = [
    {
      question: `What is the NIRF ranking of ${college.name}?`,
      answer: `${college.name} is ranked #${college.nirfRank || "Top Tier"} in the National Institutional Ranking Framework (NIRF) Engineering and Overall rankings published by the Ministry of Education.`,
    },
    {
      question: `What is the cutoff for Computer Science (CSE) at ${college.name}?`,
      answer: `Closing ranks for Computer Science vary by quota and category. General category candidates under Home State and All India quotas can view historical Round 1 to 6 closing ranks on our Cutoff tab.`,
    },
    {
      question: `How are the placements at ${college.name}?`,
      answer: `The institute maintains an audited placement percentage exceeding 90%, with leading global companies such as Microsoft, Google, Amazon, and Tata Steel recruiting across undergraduate and postgraduate branches.`,
    },
    {
      question: `Is hostel accommodation available at ${college.name}?`,
      answer: `Yes, comprehensive on-campus hostel and dining facilities are provided for both male and female students with high-speed internet, athletic complexes, and medical centers.`,
    },
  ];

  const faqs = (college.faqsJson as Array<{ question: string; answer: string }>) || defaultFaqs;
  const faqJsonLd = generateFaqJsonLd(faqs);

  return (
    <div className="space-y-6 max-w-4xl">
      <JsonLdScript data={faqJsonLd} />

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Frequently Asked Questions (Q&A)
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Verified answers regarding admissions eligibility, cutoff criteria, fees, and campus hostels.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary shrink-0" />
              <span>{faq.question}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

