import { Award, Sprout, TrendingUp, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Select } from '@/components/ui';
import { useState } from 'react';
import { mockQualityGrades, allCrops } from '@/lib/mockData';

const gradeColors = {
  A: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', badge: 'green' as const },
  B: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', badge: 'amber' as const },
  C: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', badge: 'red' as const },
};

export function QualityGuidePage() {
  const [crop, setCrop] = useState('Tomato');
  const grades = mockQualityGrades[crop] || mockQualityGrades.Tomato;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crop Quality Guide</h1>
        <p className="text-gray-500 mt-1">Learn how quality grading affects your crop pricing</p>
      </div>

      <Card className="p-4 mb-6">
        <Select label="Select Crop" value={crop} onChange={(e) => setCrop(e.target.value)} options={allCrops.map(c => ({ value: c, label: c }))} className="max-w-xs" />
      </Card>

      {/* Grade cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {grades.map(g => {
          const colors = gradeColors[g.grade as keyof typeof gradeColors];
          return (
            <Card key={g.grade} className={`p-5 ${colors.bg} ${colors.border} border-2`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${colors.text} bg-white flex items-center justify-center font-bold`}>
                    {g.grade}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Grade {g.grade}</h3>
                    <Badge variant={colors.badge}>{g.grade === 'A' ? 'Premium' : g.grade === 'B' ? 'Standard' : 'Lower'}</Badge>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {g.qualities.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.text.replace('text', 'bg')} flex-shrink-0`} />
                    {q}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="p-5 bg-gradient-to-r from-green-700 to-green-800 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Better Quality = Better Prices</h3>
            <p className="text-sm text-green-100 mt-1">
              Grade A crops can command 10-20% higher prices than Grade B. Proper harvesting, handling, and storage can help maintain quality and maximize your earnings.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <Lightbulb className="w-6 h-6 text-amber-600 mb-2" />
          <h4 className="font-semibold text-sm text-gray-900">Harvest at Right Time</h4>
          <p className="text-xs text-gray-500 mt-1">Harvest crops at peak maturity for best color and size.</p>
        </Card>
        <Card className="p-4">
          <Sprout className="w-6 h-6 text-green-700 mb-2" />
          <h4 className="font-semibold text-sm text-gray-900">Handle with Care</h4>
          <p className="text-xs text-gray-500 mt-1">Avoid bruising and damage during harvesting and transport.</p>
        </Card>
        <Card className="p-4">
          <Award className="w-6 h-6 text-green-700 mb-2" />
          <h4 className="font-semibold text-sm text-gray-900">Store Properly</h4>
          <p className="text-xs text-gray-500 mt-1">Keep crops in cool, dry conditions to maintain freshness.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
