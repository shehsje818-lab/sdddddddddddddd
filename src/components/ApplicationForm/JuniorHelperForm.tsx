import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "./FormField";
import { JuniorHelperForm as JuniorHelperFormData } from "./types";
import { toast } from "@/hooks/use-toast";

interface JuniorHelperFormProps {
  onSubmit?: (formData: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

export function JuniorHelperForm({ onSubmit, isSubmitting: externalSubmitting = false }: JuniorHelperFormProps) {
  const [formData, setFormData] = useState<Partial<JuniorHelperFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || formData.age < 13) {
      newErrors.age = "Age must be 13 or older";
    }
    if (!formData.discordUserId?.trim()) {
      newErrors.discordUserId = "Discord User ID is required";
    }
    if (!formData.hasWorkingMicrophone) {
      newErrors.hasWorkingMicrophone = "Please select an option";
    }
    if (!formData.aboutYourself?.trim()) {
      newErrors.aboutYourself = "This field is required";
    }
    if (!formData.whyHireYou?.trim()) {
      newErrors.whyHireYou = "This field is required";
    }
    if (!formData.whyStaffMember?.trim()) {
      newErrors.whyStaffMember = "This field is required";
    }
    if (!formData.rulesKnowledge?.trim()) {
      newErrors.rulesKnowledge = "This field is required";
    }
    if (!formData.inGameInfo?.trim()) {
      newErrors.inGameInfo = "This field is required";
    }
    if (!formData.previousExperience?.trim()) {
      newErrors.previousExperience = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (onSubmit) {
      await onSubmit(formData);
    } else {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Application Submitted",
        description: "Your Junior Helper application has been received. We will review it shortly.",
      });
      setIsSubmitting(false);
      setFormData({});
    }
  };

  const submitting = isSubmitting || externalSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Age" htmlFor="age" required error={errors.age}>
        <Input
          id="age"
          type="number"
          min={13}
          value={formData.age || ""}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
          className="max-w-[180px]"
        />
      </FormField>

      <FormField label="Discord User ID" htmlFor="discordUserId" required error={errors.discordUserId}>
        <Input
          id="discordUserId"
          type="text"
          value={formData.discordUserId || ""}
          onChange={(e) => setFormData({ ...formData, discordUserId: e.target.value })}
          placeholder="e.g., 123456789012345678"
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Do you have a working microphone?" htmlFor="hasWorkingMicrophone" required error={errors.hasWorkingMicrophone}>
        <Select
          value={formData.hasWorkingMicrophone}
          onValueChange={(value: 'yes' | 'no') => setFormData({ ...formData, hasWorkingMicrophone: value })}
        >
          <SelectTrigger className="max-w-[180px]" id="hasWorkingMicrophone">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Tell us about yourself" htmlFor="aboutYourself" required error={errors.aboutYourself}>
        <Textarea
          id="aboutYourself"
          value={formData.aboutYourself || ""}
          onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField label="Why should we hire you?" htmlFor="whyHireYou" required error={errors.whyHireYou}>
        <Textarea
          id="whyHireYou"
          value={formData.whyHireYou || ""}
          onChange={(e) => setFormData({ ...formData, whyHireYou: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField label="Why do you want to become a staff member on our server?" htmlFor="whyStaffMember" required error={errors.whyStaffMember}>
        <Textarea
          id="whyStaffMember"
          value={formData.whyStaffMember || ""}
          onChange={(e) => setFormData({ ...formData, whyStaffMember: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField 
        label="Are you familiar with the server rules and guidelines?" 
        htmlFor="rulesKnowledge" 
        required 
        error={errors.rulesKnowledge}
        description="If yes, explain how you would handle a situation where a member is breaking the rules."
      >
        <Textarea
          id="rulesKnowledge"
          value={formData.rulesKnowledge || ""}
          onChange={(e) => setFormData({ ...formData, rulesKnowledge: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField 
        label="In-game information" 
        htmlFor="inGameInfo" 
        required 
        error={errors.inGameInfo}
        description="Include: In-game name (IGN), Rank, Fakepixel networth, Total playtime"
      >
        <Textarea
          id="inGameInfo"
          value={formData.inGameInfo || ""}
          onChange={(e) => setFormData({ ...formData, inGameInfo: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField 
        label="Previous staff experience" 
        htmlFor="previousExperience" 
        required 
        error={errors.previousExperience}
        description="Have you been a staff member in another server? If yes, describe your strengths and weaknesses."
      >
        <Textarea
          id="previousExperience"
          value={formData.previousExperience || ""}
          onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
          rows={4}
        />
      </FormField>

      <FormField label="Additional information" htmlFor="additionalInfo">
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo || ""}
          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          rows={3}
        />
      </FormField>

      <div className="pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
