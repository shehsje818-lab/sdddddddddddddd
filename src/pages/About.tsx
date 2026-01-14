import { PageLayout } from "@/components/Layout/PageLayout";

const features = [
  {
    title: "What is Fakepixel Giveaways?",
    description: "Fakepixel Giveaways is a Discord server that hosts giveaways and provides carrier services for the Fakepixel game. We organize events, manage carriers, and maintain a community for players.",
  },
  {
    title: "Why do we need staff and carriers?",
    description: "Staff members help moderate the server, assist members, and ensure the community runs smoothly. Carriers provide in-game services to help other players progress through dungeon floors and slayer bosses.",
  },
  {
    title: "How are applications reviewed?",
    description: "All applications are reviewed by the admin team. We evaluate each application based on the information provided, including experience, availability, and qualifications. You will be contacted through Discord if accepted.",
  },
];

const requirements = [
  "Staff applicants must be at least 13 years old",
  "Carrier applicants must not be involved with competing giveaway servers",
  "All information provided must be accurate and truthful",
  "Applications are processed in the order they are received",
];

const About = () => {
  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              About
            </h1>
            <p className="text-muted-foreground">
              Learn more about Fakepixel Giveaways and what we're looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-8">
            {features.map((feature) => (
              <div key={feature.title}>
                <h3 className="text-base font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-12 border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-base font-medium text-foreground mb-4">
              Requirements
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {requirements.map((req, index) => (
                <li key={index}>— {req}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
