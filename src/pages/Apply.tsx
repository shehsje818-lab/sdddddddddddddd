import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/api";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JuniorHelperForm } from "@/components/ApplicationForm/JuniorHelperForm";
import { SlayerCarrierForm } from "@/components/ApplicationForm/SlayerCarrierForm";
import { DungeonCarrierForm } from "@/components/ApplicationForm/DungeonCarrierForm";
import { PositionType } from "@/components/ApplicationForm/types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const positions = [
  { value: "junior-helper", label: "Junior Helper", category: "Staff" },
  { value: "dungeon-carrier", label: "Dungeon Carrier", category: "Carrier" },
  { value: "slayer-carrier", label: "Slayer Carrier", category: "Carrier" },
] as const;

interface FormSubmitData {
  position: PositionType;
  formData: Record<string, any>;
}

const Apply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<PositionType | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const selectedPositionData = positions.find(p => p.value === selectedPosition);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    if (!user || !selectedPosition) {
      alert('Please log in and select a position');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(API_ENDPOINTS.APPLICATIONS_SUBMIT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          position: selectedPosition,
          formData
        })
      });

      if (response.ok) {
        setSuccessDialog(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        const error = await response.json();
        alert(`Failed to submit application: ${error.error}`);
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <section className="border-b border-border">
          <div className="container py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Apply
              </h1>
              <p className="text-muted-foreground mb-4">
                You must be logged in to apply.
              </p>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  const renderForm = () => {
    switch (selectedPosition) {
      case "junior-helper":
        return <JuniorHelperForm onSubmit={handleFormSubmit} isSubmitting={submitting} />;
      case "slayer-carrier":
        return <SlayerCarrierForm onSubmit={handleFormSubmit} isSubmitting={submitting} />;
      case "dungeon-carrier":
        return <DungeonCarrierForm onSubmit={handleFormSubmit} isSubmitting={submitting} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Apply
            </h1>
            <p className="text-muted-foreground">
              Select a position and complete the application form.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-10 md:py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Position Selector */}
            <div className="mb-8">
              <Label htmlFor="position-select" className="text-sm font-medium text-foreground mb-2 block">
                Position
              </Label>
              <Select
                value={selectedPosition}
                onValueChange={(value: PositionType) => setSelectedPosition(value)}
              >
                <SelectTrigger className="h-10 bg-background" id="position-select">
                  <SelectValue placeholder="Select a position..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="junior-helper">Junior Helper (Staff)</SelectItem>
                  <SelectItem value="dungeon-carrier">Dungeon Carrier</SelectItem>
                  <SelectItem value="slayer-carrier">Slayer Carrier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form Container */}
            {selectedPosition && (
              <div className="border border-border rounded-md">
                <div className="px-5 py-3 border-b border-border bg-secondary/30">
                  <h2 className="text-base font-medium text-foreground">
                    {selectedPositionData?.label} Application
                  </h2>
                </div>
                <div className="p-5">
                  {renderForm()}
                </div>
              </div>
            )}

            {!selectedPosition && (
              <p className="text-sm text-muted-foreground">
                Select a position above to view the application form.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Success Dialog */}
      <AlertDialog open={successDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Application Submitted!</AlertDialogTitle>
            <AlertDialogDescription>
              Your application has been successfully submitted. You'll be redirected to your profile in a moment. Our team will review your application and contact you through Discord.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Apply;
