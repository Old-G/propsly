"use client";

import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TerminalBlock } from "./terminal-block";

export function OpenSourceSection() {
  return (
    <SectionWrapper>
      <div className="text-center">
        <p className="section-label">OPEN SOURCE</p>
        <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl">
          Your data. Your server. Your rules.
        </h2>
        <p
          className="mt-6 text-lg max-w-[600px] mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Propsly is AGPL-3.0 licensed. Self-host on your server with Docker in
          one command. Full source code on GitHub. No vendor lock-in. No data
          leaves your infrastructure.
        </p>
      </div>

      <div className="mt-12 max-w-[560px] mx-auto">
        <TerminalBlock />
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="https://github.com/Old-G/propsly"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          View on GitHub &rarr;
        </a>
        <a
          href="https://github.com/Old-G/propsly"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          &#11088; Star
        </a>
      </div>
    </SectionWrapper>
  );
}
