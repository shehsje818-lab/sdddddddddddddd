import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "./FormField";
import { DungeonCarrierForm as DungeonCarrierFormData } from "./types";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface DungeonCarrierFormProps {
  onSubmit?: (formData: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

export function DungeonCarrierForm({ onSubmit, isSubmitting: externalSubmitting = false }: DungeonCarrierFormProps) {
  const [formData, setFormData] = useState<Partial<DungeonCarrierFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNotEligible = formData.involvedWithGiveawayServers === "yes-not-eligible";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.discordUserId?.trim()) {
      newErrors.discordUserId = "Discord User ID is required";
    }
    if (!formData.inGameName?.trim()) {
      newErrors.inGameName = "In-game name is required";
    }
    if (!formData.networth?.trim()) {
      newErrors.networth = "Networth is required";
    }
    if (!formData.totalPlaytime?.trim()) {
      newErrors.totalPlaytime = "Total playtime is required";
    }
    if (!formData.catacombsLevel || formData.catacombsLevel < 18) {
      newErrors.catacombsLevel = "Catacombs level must be 18 or higher";
    }
    if (!formData.dungeonClasses?.trim()) {
      newErrors.dungeonClasses = "Dungeon classes are required";
    }
    if (!formData.classLevels?.trim()) {
      newErrors.classLevels = "Class levels are required";
    }
    if (!formData.floorsCanCarry?.trim()) {
      newErrors.floorsCanCarry = "This field is required";
    }
    if (!formData.availability?.trim()) {
      newErrors.availability = "Availability is required";
    }
    if (!formData.involvedWithGiveawayServers) {
      newErrors.involvedWithGiveawayServers = "Please select an option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNotEligible) {
      toast({
        title: "Not Eligible",
        description: "You are not eligible to apply because you are involved with other giveaway servers.",
        variant: "destructive",
      });
      return;
    }

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
        description: "Your Dungeon Carrier application has been received. We will review it shortly.",
      });
      setIsSubmitting(false);
      setFormData({});
    }
  };

  const submitting = isSubmitting || externalSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <FormField label="In-game name" htmlFor="inGameName" required error={errors.inGameName}>
        <Input
          id="inGameName"
          type="text"
          value={formData.inGameName || ""}
          onChange={(e) => setFormData({ ...formData, inGameName: e.target.value })}
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Fakepixel networth" htmlFor="networth" required error={errors.networth} description="Example: 100M, 1B">
        <Input
          id="networth"
          type="text"
          value={formData.networth || ""}
          onChange={(e) => setFormData({ ...formData, networth: e.target.value })}
          placeholder="e.g., 500M"
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Total playtime" htmlFor="totalPlaytime" required error={errors.totalPlaytime} description="Example: 500 hours">
        <Input
          id="totalPlaytime"
          type="text"
          value={formData.totalPlaytime || ""}
          onChange={(e) => setFormData({ ...formData, totalPlaytime: e.target.value })}
          placeholder="e.g., 500 hours"
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Catacombs level" htmlFor="catacombsLevel" required error={errors.catacombsLevel} description="Minimum: 18">
        <Input
          id="catacombsLevel"
          type="number"
          min={18}
          value={formData.catacombsLevel || ""}
          onChange={(e) => setFormData({ ...formData, catacombsLevel: parseInt(e.target.value) || undefined })}
          className="max-w-[180px]"
        />
      </FormField>

      <FormField 
        label="Dungeon classes you can play confidently" 
        htmlFor="dungeonClasses" 
        required 
        error={errors.dungeonClasses}
        description="Options include: Mage, Archer, Tank, Healer, Berserk"
      >
        <Input
          id="dungeonClasses"
          type="text"
          value={formData.dungeonClasses || ""}
          onChange={(e) => setFormData({ ...formData, dungeonClasses: e.target.value })}
          placeholder="e.g., Mage, Archer"
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Levels of those dungeon classes" htmlFor="classLevels" required error={errors.classLevels}>
        <Textarea
          id="classLevels"
          value={formData.classLevels || ""}
          onChange={(e) => setFormData({ ...formData, classLevels: e.target.value })}
          placeholder="e.g., Mage: 35, Archer: 28"
          rows={3}
        />
      </FormField>

      <FormField label="Floors you can carry" htmlFor="floorsCanCarry" required error={errors.floorsCanCarry} description="Example: F5–F7, M1–M3">
        <Input
          id="floorsCanCarry"
          type="text"
          value={formData.floorsCanCarry || ""}
          onChange={(e) => setFormData({ ...formData, floorsCanCarry: e.target.value })}
          placeholder="e.g., F5-F7, M1-M3"
          className="max-w-sm"
        />
      </FormField>

      <FormField label="Availability for carries" htmlFor="availability" required error={errors.availability} description="Per day or per week">
        <Input
          id="availability"
          type="text"
          value={formData.availability || ""}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          placeholder="e.g., 2-3 hours per day"
          className="max-w-sm"
        />
      </FormField>

      <FormField 
        label="Are you involved with any giveaway servers that host Fakepixel giveaways?" 
        htmlFor="involvedWithGiveawayServers" 
        required 
        error={errors.involvedWithGiveawayServers}
      >
        <Select
          value={formData.involvedWithGiveawayServers}
          onValueChange={(value: 'no' | 'yes-not-eligible') => setFormData({ ...formData, involvedWithGiveawayServers: value })}
        >
          <SelectTrigger className="max-w-[280px]" id="involvedWithGiveawayServers">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes-not-eligible">Yes — Not Eligible</SelectItem>
          </SelectContent>
        </Select>
        {isNotEligible && (
          <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md" role="alert">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">
                You are not eligible to apply. Applicants involved with other giveaway servers cannot be accepted.
              </p>
            </div>
          </div>
        )}
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
        <Button type="submit" disabled={submitting || isNotEligible}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}

