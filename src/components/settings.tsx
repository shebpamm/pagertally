import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Settings } from "lucide-react";

interface StandbyCompensationSettingsProps {
  onCompensationChange: (value: number) => void;
}

export default function StandbyCompensationSettings({ onCompensationChange }: StandbyCompensationSettingsProps) {

  const [isOpen, setIsOpen] = useState(typeof window !== undefined ? false : (localStorage.getItem("standbyCompensation") ? false : true));
  const [compensation, setCompensation] = useLocalStorage<number>("standbyCompensation", 0);

  const handleSave = () => {
    const compensationNumber = parseFloat(compensation.toString());
    setCompensation(compensationNumber);
    onCompensationChange(compensationNumber);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Settings className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Standby Duty Compensation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="compensation" className="text-sm font-medium">
              Compensation:
            </label>
            <Input
              id="compensation"
              type="number"
              value={compensation}
              onChange={(e) => setCompensation(parseFloat(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
