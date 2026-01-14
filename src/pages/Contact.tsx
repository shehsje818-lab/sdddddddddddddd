import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertCircle } from "lucide-react";

const Contact = () => {
  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our community and connect with the Fakepixel Giveaways team.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl">
          <div className="space-y-8">
            {/* Discord Servers */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Join Our Discord
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Main Server</CardTitle>
                    <CardDescription>Our main community server</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      asChild 
                      className="w-full"
                      onClick={() => window.open('https://discord.gg/72BHBVhmNJ', '_blank')}
                    >
                      <a href="https://discord.gg/72BHBVhmNJ" target="_blank" rel="noopener noreferrer">
                        Join Server
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Support Server</CardTitle>
                    <CardDescription>Get help and support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open('https://discord.gg/Bj5tcCSn3k', '_blank')}
                    >
                      <a href="https://discord.gg/Bj5tcCSn3k" target="_blank" rel="noopener noreferrer">
                        Join Support
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Guidelines */}
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-base">Application Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Please do not contact staff members directly about your application status. 
                  All applicants will be notified through official channels once a decision has been made.
                </p>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">For Urgent Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    If anything super important needs immediate attention, please contact{' '}
                    <span className="font-semibold text-foreground">darkwall0901_</span> on Discord.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
