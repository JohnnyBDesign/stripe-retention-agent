export default function Compare() {
  return (
    <section id="compare" className="border-y border-afterwhy-line bg-afterwhy-elevated scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-afterwhy-paper mb-8 text-center">
          Why not SaveMRR?
        </h2>
        <div className="bg-afterwhy-ink border-2 border-afterwhy-line rounded-card overflow-hidden max-w-3xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-afterwhy-line">
                  <th className="text-left p-4 font-bold text-afterwhy-paper"></th>
                  <th className="text-left p-4 font-bold text-afterwhy-paper">
                    AfterWhy
                  </th>
                  <th className="text-left p-4 font-bold text-afterwhy-mono">
                    SaveMRR
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-afterwhy-line">
                  <td className="p-4 font-medium text-afterwhy-muted">
                    Approach
                  </td>
                  <td className="p-4 text-afterwhy-paper">
                    Reason brain after the signal + silent renewers
                  </td>
                  <td className="p-4 text-afterwhy-mono">
                    Cancel Shield widget + autopilot recovery
                  </td>
                </tr>
                <tr className="border-b border-afterwhy-line">
                  <td className="p-4 font-medium text-afterwhy-muted">
                    Delivery
                  </td>
                  <td className="p-4 text-afterwhy-paper">
                    BYO Resend segments
                  </td>
                  <td className="p-4 text-afterwhy-mono">
                    Autopilot dunning engines
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-afterwhy-muted">
                    Control
                  </td>
                  <td className="p-4 text-afterwhy-paper">HITL required</td>
                  <td className="p-4 text-afterwhy-mono">
                    Autopilot by default
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-8 text-center text-lg text-afterwhy-paper font-medium">
          Cancel flows save the click. We save the customer after we know why.
        </p>
      </div>
    </section>
  );
}
