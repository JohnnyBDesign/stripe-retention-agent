import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProductWindow() {
  return (
    <section className="relative py-20 px-6 md:px-8" id="product">
      <div className="mx-auto max-w-content relative z-10">
        {/* Technical window chrome */}
        <div className="rounded-lg overflow-hidden bg-card border border-border">
          {/* Window chrome - minimal */}
          <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
            <span className="ml-4 font-mono text-label uppercase tracking-[0.05em] text-muted-foreground">Approval Queue</span>
          </div>

          {/* Queue Card */}
          <div className="p-8 md:p-12">
            <Card className="bg-muted border-border p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <Badge variant="outline" className="mb-3">
                    silent_rescue
                  </Badge>
                  <h3 className="font-body text-heading mb-2 font-semibold">
                    Needs approval
                  </h3>
                  <p className="font-body text-body text-muted-foreground">
                    Customer downgrading from $249 → $99 due to price concerns
                  </p>
                </div>
              </div>

              {/* Draft preview */}
              <div className="bg-background rounded-md p-6 mb-6 border border-border">
                <p className="font-mono text-label uppercase tracking-[0.05em] text-muted-foreground mb-2">
                  Draft Subject
                </p>
                <p className="font-body text-body mb-4">
                  Quick question before you go
                </p>
                <p className="font-mono text-label uppercase tracking-[0.05em] text-muted-foreground mb-2">
                  Classification
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  ret_price · Signal will send from our Resend
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default">
                  Approve & send
                </Button>
                <Button variant="outline">
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
