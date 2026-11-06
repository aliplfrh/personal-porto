import React, { useState } from 'react';
import { useSiteContent } from '../content/SiteContentContext';
import { ToolEntry } from '../content/types';
import Reveal from './Reveal';
import './ProfileSections.css';

/**
 * Static groupings for the tools the portfolio actually uses. Every tool from
 * `content.tools` (admin-editable) is rendered exactly once: unknown tools fall
 * back to the last group instead of being dropped.
 */
const TOOL_GROUPS: Array<{ id: string; title: string; tools: string[] }> = [
  {
    id: 'post',
    title: 'Video & post-production',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'CapCut', 'After Effects'],
  },
  {
    id: 'design',
    title: 'Design & visual tools',
    tools: [
      'Affinity Designer',
      'Affinity Photo',
      'Figma',
      'Canva',
      'Photoshop',
      'Illustrator',
    ],
  },
];

const groupFor = (toolName: string): string => {
  const match = TOOL_GROUPS.find((group) =>
    group.tools.some((name) => name.toLowerCase() === toolName.toLowerCase())
  );
  return match ? match.id : TOOL_GROUPS[TOOL_GROUPS.length - 1].id;
};

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('');

interface ToolIconProps {
  tool: ToolEntry;
}

const ToolIcon: React.FC<ToolIconProps> = ({ tool }) => {
  // Icons are decorative here: every tile repeats the tool name as visible text,
  // so the image is hidden from assistive tech instead of announced twice.
  const [failed, setFailed] = useState(!tool.iconUrl);

  if (failed) {
    return (
      <span className="stack-icon stack-icon-fallback" aria-hidden="true">
        {initialsOf(tool.name)}
      </span>
    );
  }

  return (
    <img
      className="stack-icon"
      src={tool.iconUrl}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={28}
      height={28}
      onError={() => setFailed(true)}
    />
  );
};

const TechStack: React.FC = () => {
  const { content } = useSiteContent();

  const groupedTools = TOOL_GROUPS.map((group) => ({
    ...group,
    items: content.tools.filter((tool) => groupFor(tool.name) === group.id),
  }));

  return (
    <section className="prf-section prf-stack-section" id="tech-stack" aria-labelledby="prf-stack-heading">
      <div className="prf-container">
        <Reveal from="up" amount={0.35}>
          <div className="prf-section-head">
            <p className="prf-eyebrow">
              <span>Tech Stack</span>
            </p>
            <h2 className="prf-heading" id="prf-stack-heading">
              Skills &amp; technologies
            </h2>
            <p className="prf-sub">
              The tools behind the cut and the frame, kept deliberately short: editing, grading, and design.
            </p>
          </div>
        </Reveal>

        {/* Quiet strip, static on purpose — no marquee, so nothing moves while reading. */}
        <Reveal from="up" amount={0.2}>
          <ul className="stack-strip" aria-hidden="true">
            {content.tools.map((tool) => (
              <li className="stack-strip-item" key={tool.name}>
                <ToolIcon tool={tool} />
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="stack-grids">
          {groupedTools.map((group, groupIndex) => (
            <Reveal key={group.id} from="up" delay={groupIndex + 1} amount={0.2} className="prf-reveal-block">
              <section className="stack-group" aria-labelledby={`prf-stack-group-${group.id}`}>
                <h3 className="stack-group-title" id={`prf-stack-group-${group.id}`}>
                  {group.title}
                </h3>

                <ul className="stack-tool-grid">
                  {group.items.map((tool) => (
                    <li className="stack-tool" key={tool.name}>
                      <span className="stack-tool-icon">
                        <ToolIcon tool={tool} />
                      </span>
                      <span className="stack-tool-name">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
