'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cotisation } from '../models';

interface AddCotisationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (cotisation: Omit<Cotisation, 'id'>) => void;
}

export function AddCotisationDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCotisationDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    monthYear: '',
    montant: 0,
    cotisationId: 0,
    userName: '',
    userMatricule: '',
    recapitulatifCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form
    setFormData({
      code: '',
      monthYear: '',
      montant: 0,
      cotisationId: 0,
      userName: '',
      userMatricule: '',
      recapitulatifCode: '',
    });
    onOpenChange(false);
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      field === 'montant' || field === 'cotisationId'
        ? parseFloat(e.target.value) || 0
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Cotisation</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new cotisation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={handleChange('code')}
                placeholder="e.g., COT-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthYear">Month/Year</Label>
              <Input
                id="monthYear"
                value={formData.monthYear}
                onChange={handleChange('monthYear')}
                placeholder="e.g., 2025-01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant</Label>
              <Input
                id="montant"
                type="number"
                value={formData.montant || ''}
                onChange={handleChange('montant')}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cotisationId">Cotisation ID</Label>
              <Input
                id="cotisationId"
                type="number"
                value={formData.cotisationId || ''}
                onChange={handleChange('cotisationId')}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={handleChange('userName')}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userMatricule">User Matricule</Label>
              <Input
                id="userMatricule"
                value={formData.userMatricule}
                onChange={handleChange('userMatricule')}
                placeholder="e.g., USR-001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recapitulatifCode">Recapitulatif Code</Label>
            <Input
              id="recapitulatifCode"
              value={formData.recapitulatifCode}
              onChange={handleChange('recapitulatifCode')}
              placeholder="e.g., REC-2025-01"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Cotisation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

