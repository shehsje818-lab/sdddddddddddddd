import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PositionCard } from "@/components/ui/PositionCard";
import { MessageCircle } from "lucide-react";


const Index = () => {
  const { user } = useAuth();

  const handleDiscordLogin = () => {
    try {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Discord Client ID is not configured');
      }
      
      const redirectUri = `${window.location.origin}/auth/discord/callback`;
      const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`;
      
      window.location.href = discordAuthUrl;
    } catch (err) {
      console.error('Discord login error:', err);
      alert(err instanceof Error ? err.message : 'Failed to initiate Discord login');
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="container py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Fakepixel Giveaways Team
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-primary mb-6 font-semibold">
              Apply Server
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Join our community and apply to become part of the Fakepixel Giveaways team. We're looking for dedicated members to help grow our Discord community.
            </p>
            
            <div className="flex gap-3 flex-wrap">
              {!user ? (
                <>
                  <Button onClick={handleDiscordLogin} className="bg-indigo-600 hover:bg-indigo-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join with Discord
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild>
                    <Link to="/apply">Begin Application</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-14 md:py-16">
        <div className="container">
          <div className="mb-10">
            <h2 className="text-xl font-medium text-foreground mb-2">
              Available Positions
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose a position that fits your experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <PositionCard
              title="Staff Positions"
              description="Help moderate and assist members."
              positions={["Junior Helper"]}
            />
            <PositionCard
              title="Carrier Positions"
              description="Help players through content."
              positions={["Dungeon Carrier", "Slayer Carrier"]}
            />
          </div>
        </div>
      </section>

      {/* Reassurance Section */}
      <section className="py-12 border-t border-border bg-card">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm text-muted-foreground mb-4">
              All applications are reviewed by our team. You'll hear back from us through Discord once we've reviewed your submission.
            </p>
            {user ? (
              <Button asChild>
                <Link to="/apply">Begin Application</Link>
              </Button>
            ) : (
              <Button onClick={handleDiscordLogin} className="bg-indigo-600 hover:bg-indigo-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join with Discord
              </Button>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
