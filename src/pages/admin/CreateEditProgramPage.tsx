import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { programService } from '../../services/programService';

const programSchema = z.object({
  name: z.string().min(3, 'Program name must be at least 3 characters'),
  programCode: z.string().min(3, 'Program code is required (e.g. EDU-PUN-2026-01)'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location city is required'),
  address: z.string().min(5, 'Full address is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  maxParticipants: z.number().min(1, 'Max participants must be at least 1'),
  volunteerRequirement: z.number().min(0, 'Volunteer requirement must be 0 or more'),
  targetAudience: z.string().min(2, 'Target audience is required'),
  areaOfInterest: z.string().min(2, 'Area of interest is required'),
  status: z.enum(['DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
});

type ProgramFormData = z.infer<typeof programSchema>;

export const CreateEditProgramPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      status: 'ACTIVE',
      category: 'Education & Technology',
      maxParticipants: 100,
      volunteerRequirement: 15,
      date: '2026-09-20',
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      location: 'Pune',
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchExisting();
    }
  }, [id]);

  const fetchExisting = async () => {
    const res = await programService.getProgramById(id!);
    if (res.success && res.data) {
      const p = res.data;
      setValue('name', p.name);
      setValue('programCode', p.programCode);
      setValue('category', p.category);
      setValue('description', p.description);
      setValue('location', p.location);
      setValue('address', p.address);
      setValue('date', p.date.split('T')[0]);
      setValue('startTime', p.startTime);
      setValue('endTime', p.endTime);
      setValue('maxParticipants', p.maxParticipants);
      setValue('volunteerRequirement', p.volunteerRequirement);
      setValue('targetAudience', p.targetAudience);
      setValue('areaOfInterest', p.areaOfInterest);
      setValue('status', p.status);
    }
  };

  const onSubmit = async (data: ProgramFormData) => {
    setSubmitting(true);
    if (isEdit && id) {
      await programService.updateProgram(id, {
        ...data,
        date: new Date(data.date).toISOString(),
      });
    } else {
      await programService.createProgram({
        ...data,
        date: new Date(data.date).toISOString(),
      });
    }
    setSubmitting(false);
    navigate('/admin/programs');
  };

  const categories = [
    { value: 'Education & Technology', label: 'Education & Technology' },
    { value: 'Environment & Sustainability', label: 'Environment & Sustainability' },
    { value: 'Healthcare & Wellness', label: 'Healthcare & Wellness' },
    { value: 'Vocational Training', label: 'Vocational Training' },
    { value: 'Agriculture & Green Tech', label: 'Agriculture & Green Tech' },
  ];

  const statuses = [
    { value: 'DRAFT', label: 'DRAFT' },
    { value: 'UPCOMING', label: 'UPCOMING' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ];

  return (
    <ApplicationShell>
      <button
        onClick={() => navigate('/admin/programs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Programs List
      </button>

      <PageHeader
        title={isEdit ? 'Edit Program' : 'Create New Program'}
        subtitle="Multi-section program configuration form adhering to integration contract."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        {/* Section 1: Basic Information */}
        <Card variant="solid" className="p-6 space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">1. Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Program Name *" placeholder="e.g. Community STEM Workshop" {...register('name')} error={errors.name?.message} />
            <Input label="Program Code *" placeholder="e.g. EDU-PUN-2026-01" {...register('programCode')} error={errors.programCode?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select label="Category *" options={categories} {...register('category')} error={errors.category?.message} />
            <Select label="Status *" options={statuses} {...register('status')} error={errors.status?.message} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">Description *</label>
            <textarea
              rows={4}
              className="w-full bg-white text-slate-900 text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Detailed description of objectives and activities..."
              {...register('description')}
            />
            {errors.description && <span className="text-xs text-rose-600 mt-1 block">{errors.description.message}</span>}
          </div>
        </Card>

        {/* Section 2: Schedule & Location */}
        <Card variant="solid" className="p-6 space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">2. Schedule & Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input label="Program Date *" type="date" {...register('date')} error={errors.date?.message} />
            <Input label="Start Time *" placeholder="09:00 AM" {...register('startTime')} error={errors.startTime?.message} />
            <Input label="End Time *" placeholder="04:00 PM" {...register('endTime')} error={errors.endTime?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="City / Location *" placeholder="e.g. Pune" {...register('location')} error={errors.location?.message} />
            <Input label="Full Address *" placeholder="Community Hall, Sector 4..." {...register('address')} error={errors.address?.message} />
          </div>
        </Card>

        {/* Section 3: Configuration */}
        <Card variant="solid" className="p-6 space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">3. Configuration & Capacity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Maximum Participants *" type="number" {...register('maxParticipants', { valueAsNumber: true })} error={errors.maxParticipants?.message} />
            <Input label="Volunteer Requirement *" type="number" {...register('volunteerRequirement', { valueAsNumber: true })} error={errors.volunteerRequirement?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Target Audience *" placeholder="e.g. Students aged 12–18" {...register('targetAudience')} error={errors.targetAudience?.message} />
            <Input label="Area of Interest *" placeholder="e.g. STEM & Robotics" {...register('areaOfInterest')} error={errors.areaOfInterest?.message} />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/programs')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Save Program Changes' : 'Create Program'}
          </Button>
        </div>
      </form>
    </ApplicationShell>
  );
};
