import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProductWindow() {
  return (
    <section className="relative py-20 px-6 md:px-8" id="product">
      <div className="mx-auto max-w-content relative z-10">
        {/* Technical window chrome */}
        <div className="rounded-card overflow-hidden bg-surface border border-border-visible">
          {/* Window chrome - minimal */}
          <div className="h-10 bg-surface-raised border-b border-border flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-text-disabled"></div>
            <div className="w-2 h-2 rounded-full bg-text-disabled"></div>
            <div className="w-2 h-2 rounded-full bg-text-disabled"></div>
            <span className="ml-4 font-mono text-caption uppercase tracking-[0.08em] text-text-disabled">HITL Queue</span>
          </div>

          {/* HITL Card */}
          <div className="p-8 md:p-12">
            <Card className="bg-black border-border-visible p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <Badge variant="warning" className="mb-3">
                    silent_rescue
                  </Badge>
                  <h3 className="font-body text-heading text-text-display mb-2 font-medium">
                    Needs approval
                  </h3>
                  <p className="font-body text-body-sm text-text-secondary">
                    Customer downgrading from $249 → $99 due to price concerns
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-border-visible flex items-center justify-center text-text-secondary">
                  !
                </div>
              </div>

              {/* Draft preview */}
              <div className="bg-surface rounded-compact p-6 mb-6 border border-border">
                <p className="font-mono text-caption uppercase tracking-[0.08em] text-text-disabled mb-2">
                  Draft Subject
                </p>
                <p className="font-body text-body text-text-primary mb-4">
                  Quick question before you go
                </p>
                <p className="font-mono text-caption uppercase tracking-[0.08em] text-text-disabled mb-2">
                  Playbook
                </p>
                <p className="font-mono text-body-sm text-text-secondary">
                  ret_price → Resend segment offer_extension_50
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Approve & enroll
                </Button>
                <Button variant="secondary">
                  Edit draft
                </Button>
                <Button variant="ghost">
                  Skip
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
