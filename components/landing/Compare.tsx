export default function Compare() {
  return (
    <section id="compare" className="border-y border-line bg-panel scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-chalk mb-8 text-center">
          Why not SaveMRR?
        </h2>
        <div className="bg-void border-2 border-line rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-4 font-bold text-chalk"></th>
                  <th className="text-left p-4 font-bold text-chalk">
                    Us
                  </th>
                  <th className="text-left p-4 font-bold text-mute">
                    SaveMRR
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="p-4 font-medium text-mute">
                    Approach
                  </td>
                  <td className="p-4 text-chalk">
                    Reason brain after the signal + silent renewers
                  </td>
                  <td className="p-4 text-mute">
                    Cancel Shield widget + autopilot recovery
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <td className="p-4 font-medium text-mute">
                    Delivery
                  </td>
                  <td className="p-4 text-chalk">
                    BYO Resend segments
                  </td>
                  <td className="p-4 text-mute">
                    Autopilot dunning engines
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-mute">
                    Control
                  </td>
                  <td className="p-4 text-chalk">HITL required</td>
                  <td className="p-4 text-mute">
                    Autopilot by default
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-8 text-center text-lg text-chalk font-medium">
          Cancel flows save the click. We save the customer after we know why.
        </p>
      </div>
    </section>
  );
}
