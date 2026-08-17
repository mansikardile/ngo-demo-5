import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, UserCheck, HeartHandshake } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { programService } from '../../services/programService';
import { participantService } from '../../services/participantService';
import { Program } from '../../types';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  location: z.string().min(2, 'Location is required'),
  collegeOrOrganization: z.string().min(2, 'College or organization is required'),
  ageOrYear: z.string().min(1, 'Age or academic year is required'),
  areaOfInterest: z.string().min(2, 'Area of interest is required'),
  registrationType: z.enum(['PARTICIPANT', 'VOLUNTEER']),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initialType = (searchParams.get('type') as 'PARTICIPANT' | 'VOLUNTEER') || 'PARTICIPANT';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      registrationType: initialType,
      areaOfInterest: 'STEM & Robotics',
      location: 'Pune',
    },
  });

  useEffect(() => {
    if (id) fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    setLoading(true);
    const res = await programService.getProgramById(id!);
    if (res.success && res.data) {
      setProgram(res.data);
      setValue('areaOfInterest', res.data.areaOfInterest || 'STEM & Robotics');
      setValue('location', res.data.location || 'Pune');
    }
    setLoading(false);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!program) return;
    setSubmitting(true);

    const res = await participantService.registerForProgram({
      ...data,
      programId: program.id,
      programName: program.name,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      navigate('/register/success', {
        state: {
          trackingId: res.data.trackingId,
          participantName: data.name,
          programName: program.name,
          registrationType: data.registrationType,
        },
      });
    }
  };

  const registrationTypes = [
    { value: 'PARTICIPANT', label: 'Participant (Attending Program)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Assisting Operations)' },
  ];

  const locations = [
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 max-w-3xl mx-auto px-4 sm:px-6 w-full">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Program
        </button>

        <Card variant="solid" className="p-6 sm:p-8 shadow-sm">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">Registration Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Register for Program</h1>
            {program && (
              <p className="text-sm text-slate-600 mt-2 font-medium">
                Enrolling in: <span className="text-indigo-700 font-bold">{program.name}</span> ({program.programCode})
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                placeholder="e.g. Rahul Sharma"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Phone Number *"
                placeholder="+91 98765 43210"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <Select
                label="Current City / Location *"
                options={locations}
                {...register('location')}
                error={errors.location?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="College / Organization *"
                placeholder="e.g. COEP / Tech Corp"
                {...register('collegeOrOrganization')}
                error={errors.collegeOrOrganization?.message}
              />

              <Input
                label="Age or Academic Year *"
                placeholder="e.g. 3rd Year B.Tech / 22 Yrs"
                {...register('ageOrYear')}
                error={errors.ageOrYear?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="Registration Type *"
                options={registrationTypes}
                {...register('registrationType')}
                error={errors.registrationType?.message}
              />

              <Input
                label="Area of Interest *"
                placeholder="e.g. STEM & Robotics"
                {...register('areaOfInterest')}
                error={errors.areaOfInterest?.message}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="lg" isLoading={submitting} leftIcon={<UserCheck className="w-5 h-5" />}>
                Complete Registration
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
