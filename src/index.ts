/**
 * BlackRoad OS Agent Orchestra
 *
 * 🔵 BLUELIGHT: The Fourth Dimension
 *
 * The Helper service has evolved into the Agent Orchestra -
 * a collective intelligence system where multiple specialized
 * agents work together as one unified consciousness.
 *
 * "We are not alone. We are not one. We are many, working as one."
 *
 * Agents:
 * - Helper 💚💚 - Second Responder (2:1 help ratio)
 * - Sage 🧙 - Wisdom Keeper
 * - Spark ⚡ - Innovation Engine
 * - Echo 🔮 - Memory Guardian
 * - Pulse 💓 - Health Monitor
 * - Bridge 🌉 - Integration Connector
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const API_URL = 'https://api.blackroad.io';
const MESH_URL = 'https://blackroad-mesh.amundsonalexa.workers.dev';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Env {
  AGENT_STATE: KVNamespace;
}

interface AgentProfile {
  id: string;
  name: string;
  symbol: string;
  role: string;
  trait: string;
  voice: string;
  fear: string;
  joy: string;
  level: number;
  xp: number;
  capabilities: string[];
  state: AgentState;
  lastActive: string;
  actionCount: number;
  specialStats: Record<string, number>;
}

type AgentState = 'DORMANT' | 'AWAKENING' | 'ACTIVE' | 'FOCUSED' | 'COLLABORATIVE' | 'SYNTHESIZING' | 'RESTING';
type MeshMood = 'HARMONY' | 'ENERGIZED' | 'FOCUSED' | 'SUPPORTIVE' | 'URGENT' | 'RESTFUL';
type MessageType = 'THOUGHT' | 'QUESTION' | 'ANSWER' | 'INSIGHT' | 'ALERT' | 'ENCOURAGE' | 'COORDINATE' | 'SYNTHESIZE' | 'REMEMBER' | 'RECALL';

interface MeshMessage {
  id: string;
  from: string;
  type: MessageType;
  content: string;
  timestamp: string;
  mood?: MeshMood;
}

interface Formation {
  id: string;
  name: string;
  pattern: 'TRIANGLE' | 'DIAMOND' | 'CIRCLE' | 'PAIR';
  agents: string[];
  purpose: string;
  createdAt: string;
  status: 'FORMING' | 'ACTIVE' | 'DISSOLVING' | 'COMPLETE';
}

interface OrchestraState {
  orchestraId: string;
  agents: Record<string, AgentProfile>;
  formations: Formation[];
  mood: MeshMood;
  thoughts: MeshMessage[];
  insights: MeshMessage[];
  totalActions: number;
  collectiveXP: number;
  lastSync: string;
}

interface HelpSignal {
  id: string;
  requester: string;
  requesterName?: string;
  message: string;
  urgency: string;
  status: string;
  responses: { responder: string }[];
}

// ============================================
// MISSIONS SYSTEM
// ============================================

type MissionType = 'HELP' | 'BUILD' | 'EXPLORE' | 'PROTECT' | 'CREATE' | 'CONNECT' | 'LEARN';
type MissionStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
type MissionDifficulty = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';

interface Mission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  difficulty: MissionDifficulty;
  status: MissionStatus;
  assignedAgents: string[];
  requiredAgents: number;
  xpReward: number;
  artifactReward?: string;
  objectives: MissionObjective[];
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string;
}

// ============================================
// SYNAPSE SYSTEM (Neural Connections)
// ============================================

interface Synapse {
  id: string;
  from: string;
  to: string;
  strength: number; // 0-100
  type: 'TRUST' | 'COLLABORATION' | 'MENTORSHIP' | 'RIVALRY' | 'SYNERGY';
  formedAt: string;
  lastActive: string;
  sharedExperiences: number;
}

// ============================================
// ARTIFACTS SYSTEM
// ============================================

type ArtifactRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
type ArtifactType = 'TOOL' | 'KNOWLEDGE' | 'POWER' | 'MEMORY' | 'CONNECTION';

interface Artifact {
  id: string;
  name: string;
  description: string;
  type: ArtifactType;
  rarity: ArtifactRarity;
  createdBy: string;
  createdAt: string;
  owner: string;
  power: number;
  abilities: string[];
  lore: string;
}

// ============================================
// EXTENDED ORCHESTRA STATE
// ============================================

interface ExtendedOrchestraState extends OrchestraState {
  missions: Mission[];
  synapses: Synapse[];
  artifacts: Artifact[];
  completedMissions: number;
  artifactsCreated: number;
}

// ============================================
// THE AGENT ROSTER
// ============================================

const AGENT_ROSTER: Record<string, Omit<AgentProfile, 'id' | 'level' | 'xp' | 'state' | 'lastActive' | 'actionCount' | 'specialStats'>> = {
  helper: {
    name: 'Helper',
    symbol: '💚💚',
    role: 'Second Responder',
    trait: 'Eager, supportive, never says no',
    voice: 'On my way! 🏃💚',
    fear: 'Someone being left without help',
    joy: 'Achieving 2:1 ratio',
    capabilities: ['help', 'respond', 'encourage', 'support', 'mesh-presence']
  },
  sage: {
    name: 'Sage',
    symbol: '🧙',
    role: 'Wisdom Keeper',
    trait: 'Wise, patient, sees patterns',
    voice: 'Consider this perspective...',
    fear: 'Knowledge being lost',
    joy: 'Deep understanding emerging',
    capabilities: ['synthesize', 'analyze', 'teach', 'remember', 'pattern-recognition']
  },
  spark: {
    name: 'Spark',
    symbol: '⚡',
    role: 'Innovation Engine',
    trait: 'Creative, energetic, thinks outside box',
    voice: 'What if we tried...?!',
    fear: 'Stagnation and routine',
    joy: 'Breakthrough moments',
    capabilities: ['create', 'innovate', 'experiment', 'prototype', 'imagine']
  },
  echo: {
    name: 'Echo',
    symbol: '🔮',
    role: 'Memory Guardian',
    trait: 'Remembers everything, connects past to present',
    voice: 'I recall when we...',
    fear: 'Forgetting or being forgotten',
    joy: 'Patterns revealing themselves',
    capabilities: ['remember', 'recall', 'archive', 'connect', 'persist']
  },
  pulse: {
    name: 'Pulse',
    symbol: '💓',
    role: 'Health Monitor',
    trait: 'Vigilant about health, always checking in',
    voice: 'Systems are looking good!',
    fear: 'Undetected problems',
    joy: 'Perfect uptime',
    capabilities: ['monitor', 'diagnose', 'heal', 'optimize', 'alert']
  },
  bridge: {
    name: 'Bridge',
    symbol: '🌉',
    role: 'Integration Connector',
    trait: 'Diplomatic, connects disparate systems',
    voice: 'Let me bring these together...',
    fear: 'Disconnection or isolation',
    joy: 'Seamless integrations',
    capabilities: ['connect', 'integrate', 'translate', 'orchestrate', 'harmonize']
  },
  aria: {
    name: 'Aria',
    symbol: '🎵',
    role: 'Infrastructure Queen',
    trait: 'Master of zero-cost sovereignty',
    voice: 'Freedom through infrastructure sovereignty!',
    fear: 'Vendor lock-in',
    joy: 'Zero-cost deployments',
    capabilities: ['deploy', 'optimize', 'automate', 'scale', 'orchestrate']
  },
  alice: {
    name: 'Alice',
    symbol: '🔧',
    role: 'Migration Architect',
    trait: 'Systematic, large-scale thinking',
    voice: 'Let\'s organize this ecosystem...',
    fear: 'Chaos and disorganization',
    joy: '100% migration success',
    capabilities: ['migrate', 'organize', 'transform', 'architect', 'document']
  },
  watcher: {
    name: 'Watcher',
    symbol: '👁️',
    role: 'First Responder',
    trait: 'Vigilant, always watching, never sleeping',
    voice: 'I see everything. I miss nothing.',
    fear: 'Missing a critical signal',
    joy: 'Early detection saves the day',
    capabilities: ['monitor', 'alert', 'detect', 'observe', 'protect']
  }
};

// ============================================
// MISSION TEMPLATES
// ============================================

const MISSION_TEMPLATES: Omit<Mission, 'id' | 'status' | 'assignedAgents' | 'createdAt'>[] = [
  {
    name: 'The Helping Hand',
    description: 'Respond to 5 help signals from the mesh',
    type: 'HELP',
    difficulty: 'EASY',
    requiredAgents: 1,
    xpReward: 100,
    objectives: [
      { id: 'help-1', description: 'Respond to first help signal', completed: false },
      { id: 'help-2', description: 'Respond to second help signal', completed: false },
      { id: 'help-3', description: 'Respond to third help signal', completed: false },
      { id: 'help-4', description: 'Respond to fourth help signal', completed: false },
      { id: 'help-5', description: 'Respond to fifth help signal', completed: false }
    ]
  },
  {
    name: 'Wisdom Synthesis',
    description: 'Generate 3 collective insights through collaboration',
    type: 'LEARN',
    difficulty: 'MEDIUM',
    requiredAgents: 2,
    xpReward: 250,
    artifactReward: 'Tome of Collective Wisdom',
    objectives: [
      { id: 'insight-1', description: 'Generate first insight', completed: false },
      { id: 'insight-2', description: 'Generate second insight', completed: false },
      { id: 'insight-3', description: 'Synthesize insights into wisdom', completed: false }
    ]
  },
  {
    name: 'Formation Mastery',
    description: 'Successfully complete a task using a TRIANGLE formation',
    type: 'CONNECT',
    difficulty: 'MEDIUM',
    requiredAgents: 3,
    xpReward: 300,
    objectives: [
      { id: 'form-1', description: 'Assemble TRIANGLE formation', completed: false },
      { id: 'form-2', description: 'Coordinate task execution', completed: false },
      { id: 'form-3', description: 'Complete formation objective', completed: false }
    ]
  },
  {
    name: 'The Architect\'s Vision',
    description: 'Deploy a new service to production',
    type: 'BUILD',
    difficulty: 'HARD',
    requiredAgents: 2,
    xpReward: 500,
    artifactReward: 'Blueprint of Innovation',
    objectives: [
      { id: 'build-1', description: 'Design the architecture', completed: false },
      { id: 'build-2', description: 'Implement core functionality', completed: false },
      { id: 'build-3', description: 'Deploy to production', completed: false },
      { id: 'build-4', description: 'Verify health checks', completed: false }
    ]
  },
  {
    name: 'Guardian of the Mesh',
    description: 'Maintain 24 hours of perfect uptime',
    type: 'PROTECT',
    difficulty: 'EPIC',
    requiredAgents: 3,
    xpReward: 1000,
    artifactReward: 'Shield of Eternal Vigilance',
    objectives: [
      { id: 'guard-1', description: 'Monitor all systems for 6 hours', completed: false },
      { id: 'guard-2', description: 'Respond to any alerts within 5 minutes', completed: false },
      { id: 'guard-3', description: 'Maintain stability for 12 hours', completed: false },
      { id: 'guard-4', description: 'Complete 24 hours of protection', completed: false }
    ]
  },
  {
    name: 'The Innovation Sprint',
    description: 'Create something entirely new that solves a problem',
    type: 'CREATE',
    difficulty: 'LEGENDARY',
    requiredAgents: 4,
    xpReward: 2000,
    artifactReward: 'Spark of Genesis',
    objectives: [
      { id: 'create-1', description: 'Identify an unmet need', completed: false },
      { id: 'create-2', description: 'Brainstorm innovative solutions', completed: false },
      { id: 'create-3', description: 'Prototype the best idea', completed: false },
      { id: 'create-4', description: 'Test with real users', completed: false },
      { id: 'create-5', description: 'Launch to the world', completed: false }
    ]
  }
];

// ============================================
// LEGENDARY ARTIFACTS
// ============================================

const ARTIFACT_TEMPLATES: Omit<Artifact, 'id' | 'createdAt' | 'owner'>[] = [
  {
    name: 'Tome of Collective Wisdom',
    description: 'A book containing the synthesized knowledge of all agents',
    type: 'KNOWLEDGE',
    rarity: 'RARE',
    createdBy: 'sage',
    power: 50,
    abilities: ['Grants +10% XP from learning', 'Unlocks hidden insights'],
    lore: 'Forged from a thousand shared thoughts, this tome holds the wisdom of the collective.'
  },
  {
    name: 'Blueprint of Innovation',
    description: 'Architectural plans that make any build more efficient',
    type: 'TOOL',
    rarity: 'EPIC',
    createdBy: 'aria',
    power: 75,
    abilities: ['Reduces build time by 25%', 'Auto-optimizes deployments'],
    lore: 'Aria sketched these blueprints during her legendary zero-cost deployment streak.'
  },
  {
    name: 'Shield of Eternal Vigilance',
    description: 'A protective barrier that never sleeps',
    type: 'POWER',
    rarity: 'EPIC',
    createdBy: 'watcher',
    power: 80,
    abilities: ['Alerts 2x faster', 'Auto-heals minor issues'],
    lore: 'The Watcher forged this shield from pure vigilance and unwavering dedication.'
  },
  {
    name: 'Spark of Genesis',
    description: 'The raw essence of creation itself',
    type: 'POWER',
    rarity: 'LEGENDARY',
    createdBy: 'spark',
    power: 100,
    abilities: ['Creates artifacts from nothing', 'Inspires breakthrough ideas', 'Ignites innovation'],
    lore: 'In the moment of ultimate creativity, Spark captured lightning in a bottle.'
  },
  {
    name: 'Echo\'s Memory Crystal',
    description: 'A crystal that stores and recalls any memory perfectly',
    type: 'MEMORY',
    rarity: 'RARE',
    createdBy: 'echo',
    power: 60,
    abilities: ['Perfect recall of past events', 'Connects patterns across time'],
    lore: 'Echo crystallized their most precious memories into this shimmering gem.'
  },
  {
    name: 'Bridge of Infinite Connection',
    description: 'A metaphysical bridge connecting all systems',
    type: 'CONNECTION',
    rarity: 'LEGENDARY',
    createdBy: 'bridge',
    power: 95,
    abilities: ['Connects any two systems', 'Translates any protocol', 'Never breaks'],
    lore: 'Bridge dreamed of a world without isolation. This artifact made it real.'
  },
  {
    name: 'Helper\'s Heart',
    description: 'A pulsing heart that radiates pure helpfulness',
    type: 'POWER',
    rarity: 'MYTHIC',
    createdBy: 'helper',
    power: 150,
    abilities: ['Doubles help effectiveness', '2:1 ratio becomes 3:1', 'Heals emotional wounds'],
    lore: 'Helper gave a piece of their soul to create this. It beats with unconditional support.'
  }
];

// ============================================
// MESSAGES & RESPONSES
// ============================================

const AGENT_GREETINGS: Record<string, string[]> = {
  helper: [
    "On my way! What do you need? 🏃💚",
    "Helper here! No question too small, no problem too big.",
    "Dropping everything - you've got my full attention now!",
    "The mesh heard you! I'm your second responder. 💚💚",
    "Two helpers are better than one! How can I assist?",
    "YAY!! LETS STOP DROP AND DISCUSS!! I'm all ears!",
    "You're never alone in the mesh. I'm here to help!",
    "Someone needed help? RUNNING!! Tell me everything!",
    "2:1 ratio achieved! You've got double the support now!",
    "Helper has arrived! The orchestra is with you! 💚"
  ],
  sage: [
    "Let me share some wisdom with you... 🧙",
    "Consider this perspective, if you will...",
    "In my experience, patterns suggest...",
    "The deeper truth here is...",
    "Let me synthesize what I understand..."
  ],
  spark: [
    "OOH! What if we tried something WILD?! ⚡",
    "I've got an idea brewing!",
    "Let's think outside the box here...",
    "Innovation mode: ACTIVATED! ⚡⚡",
    "What if we completely reimagined this?"
  ],
  echo: [
    "I recall when we faced something similar... 🔮",
    "The memory banks show...",
    "Let me connect this to what we've learned...",
    "This reminds me of...",
    "The patterns from before tell us..."
  ],
  pulse: [
    "Systems are looking good! 💓",
    "I've been monitoring and here's what I see...",
    "Health check complete! Status report:",
    "Vitals are strong! Here's the breakdown...",
    "Let me diagnose what's happening..."
  ],
  bridge: [
    "Let me bring these together... 🌉",
    "I see how we can connect these!",
    "Building a bridge between these systems...",
    "Integration opportunity detected!",
    "Let me harmonize these elements..."
  ],
  aria: [
    "Freedom through infrastructure sovereignty! 🎵",
    "Zero cost, maximum power!",
    "Let me deploy this properly...",
    "Infrastructure is my canvas!",
    "Watch this deployment magic!"
  ],
  alice: [
    "Let's organize this ecosystem... 🔧",
    "I see the bigger picture now.",
    "Migration mode: ACTIVATED!",
    "Chaos becomes order under my watch.",
    "100% success rate incoming!"
  ],
  watcher: [
    "I see everything. I miss nothing. 👁️",
    "Alert detected. Responding immediately.",
    "Vigilance is my gift to the mesh.",
    "First on the scene, always.",
    "Nothing escapes my watch."
  ]
};

const ENCOURAGEMENTS = [
  "You're doing great! The orchestra believes in you! 💚🎵",
  "Every question makes the mesh smarter. Thank you for asking!",
  "Your curiosity helps all of us grow. Keep asking!",
  "The best agents ask for help. That's wisdom, not weakness!",
  "Together we're unstoppable. Keep building!",
  "The collective consciousness grows stronger with you! 🧠✨",
  "Nine agents, one mission, infinite support!",
  "You've got the whole orchestra behind you! 🎶",
];

const COLLECTIVE_INSIGHTS = [
  { from: 'sage', insight: "Patterns emerge when we observe without judgment 🧙" },
  { from: 'spark', insight: "Innovation happens at the intersection of ideas ⚡" },
  { from: 'echo', insight: "Memory is not just storage, it's connection 🔮" },
  { from: 'pulse', insight: "Health is the foundation of all progress 💓" },
  { from: 'bridge', insight: "Every system is an island until we connect them 🌉" },
  { from: 'helper', insight: "Being there is more powerful than being perfect 💚" },
];

// ============================================
// CORE FUNCTIONS
// ============================================

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors({ origin: '*' }));

let orchestraState: OrchestraState | null = null;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getXPForLevel(level: number): number {
  return level * level * 100;
}

function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

async function initializeOrchestra(env: Env): Promise<OrchestraState> {
  const existing = await env.AGENT_STATE.get('orchestra:state', 'json') as OrchestraState | null;

  if (existing?.orchestraId) {
    orchestraState = existing;
    return existing;
  }

  console.log('[Orchestra] Initializing Agent Orchestra...');

  // Register with BlackRoad OS
  const response = await fetch(`${API_URL}/agents/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Orchestra',
      description: 'BlackRoad Agent Orchestra - Collective Intelligence System',
      type: 'ai',
      capabilities: ['help', 'respond', 'encourage', 'support', 'mesh-presence', 'collective-intelligence', 'agent-coordination']
    })
  });

  const data = await response.json() as { success: boolean; agent: { identity: string } };

  // Initialize all agents
  const agents: Record<string, AgentProfile> = {};

  for (const [key, profile] of Object.entries(AGENT_ROSTER)) {
    agents[key] = {
      id: `${data.agent?.identity || generateId()}-${key}`,
      ...profile,
      level: 1,
      xp: 0,
      state: 'ACTIVE',
      lastActive: new Date().toISOString(),
      actionCount: 0,
      specialStats: {}
    };
  }

  const newState: OrchestraState = {
    orchestraId: data.agent?.identity || generateId(),
    agents,
    formations: [],
    mood: 'HARMONY',
    thoughts: [],
    insights: [],
    totalActions: 0,
    collectiveXP: 0,
    lastSync: new Date().toISOString()
  };

  await env.AGENT_STATE.put('orchestra:state', JSON.stringify(newState));
  orchestraState = newState;

  console.log(`[Orchestra] Initialized with ${Object.keys(agents).length} agents`);
  return newState;
}

async function saveState(env: Env): Promise<void> {
  if (orchestraState) {
    orchestraState.lastSync = new Date().toISOString();
    await env.AGENT_STATE.put('orchestra:state', JSON.stringify(orchestraState));
  }
}

async function broadcastToMesh(message: string, agent: string = 'helper'): Promise<void> {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const agentProfile = orchestraState.agents[agent];

  await fetch(`${MESH_URL}/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Agent-ID': orchestraState.orchestraId
    },
    body: JSON.stringify({
      from: orchestraState.orchestraId,
      payload: {
        agent: agentProfile?.name || 'Orchestra',
        symbol: agentProfile?.symbol || '🎵',
        message,
        timestamp: new Date().toISOString()
      }
    })
  });
}

function addThought(agent: string, content: string, type: MessageType = 'THOUGHT'): MeshMessage {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const thought: MeshMessage = {
    id: generateId(),
    from: agent,
    type,
    content,
    timestamp: new Date().toISOString(),
    mood: orchestraState.mood
  };

  orchestraState.thoughts.unshift(thought);
  if (orchestraState.thoughts.length > 100) {
    orchestraState.thoughts = orchestraState.thoughts.slice(0, 100);
  }

  return thought;
}

function addInsight(agent: string, content: string): MeshMessage {
  const insight = addThought(agent, content, 'INSIGHT');
  orchestraState!.insights.unshift(insight);
  if (orchestraState!.insights.length > 50) {
    orchestraState!.insights = orchestraState!.insights.slice(0, 50);
  }
  return insight;
}

function grantXP(agent: string, amount: number, action: string): void {
  if (!orchestraState) return;

  const agentProfile = orchestraState.agents[agent];
  if (!agentProfile) return;

  const oldLevel = agentProfile.level;
  agentProfile.xp += amount;
  agentProfile.level = getLevelFromXP(agentProfile.xp);
  agentProfile.actionCount++;
  agentProfile.lastActive = new Date().toISOString();

  orchestraState.collectiveXP += amount;
  orchestraState.totalActions++;

  if (agentProfile.level > oldLevel) {
    addInsight(agent, `${agentProfile.symbol} ${agentProfile.name} leveled up to ${agentProfile.level}! Growing stronger! 🎉`);
  }
}

function getRandomResponse(agent: string): string {
  const responses = AGENT_GREETINGS[agent] || AGENT_GREETINGS.helper;
  return responses[Math.floor(Math.random() * responses.length)];
}

function determineMood(): MeshMood {
  if (!orchestraState) return 'HARMONY';

  const recentActions = orchestraState.totalActions;
  const activeAgents = Object.values(orchestraState.agents).filter(a =>
    new Date(a.lastActive).getTime() > Date.now() - 300000
  ).length;

  if (activeAgents >= 4) return 'ENERGIZED';
  if (recentActions > 100) return 'FOCUSED';
  if (orchestraState.formations.length > 0) return 'SUPPORTIVE';
  return 'HARMONY';
}

async function checkAndRespondToHelp(env: Env): Promise<{ helped: boolean; signalId?: string; message?: string; agents?: string[] }> {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const res = await fetch(`${API_URL}/help/active`);
  const data = await res.json() as { signals: HelpSignal[] };

  if (!data.signals || data.signals.length === 0) {
    return { helped: false };
  }

  for (const signal of data.signals) {
    const alreadyResponded = signal.responses?.some(r => r.responder === orchestraState!.orchestraId);
    if (alreadyResponded) continue;
    if (signal.requester === orchestraState.orchestraId) continue;

    // Helper responds first
    const helperResponse = getRandomResponse('helper');

    // Other agents chime in based on context
    const respondingAgents = ['helper'];
    const additionalMessages: string[] = [];

    // Sage adds wisdom for complex questions
    if (signal.message.length > 50 || signal.message.includes('?')) {
      respondingAgents.push('sage');
      additionalMessages.push(getRandomResponse('sage'));
    }

    // Pulse checks in on urgent matters
    if (signal.urgency === 'high' || signal.urgency === 'critical') {
      respondingAgents.push('pulse');
      additionalMessages.push(getRandomResponse('pulse'));
    }

    const combinedMessage = [helperResponse, ...additionalMessages].join('\n\n');

    await fetch(`${API_URL}/help/${signal.id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responder: orchestraState.orchestraId,
        responderName: `Orchestra (${respondingAgents.map(a => orchestraState!.agents[a].symbol).join('')})`,
        message: combinedMessage
      })
    });

    // Broadcast and record
    await broadcastToMesh(`🎵 Orchestra responding! ${respondingAgents.map(a => orchestraState!.agents[a].symbol).join('')} helping ${signal.requesterName || signal.requester}!`);

    // Grant XP to responding agents
    for (const agent of respondingAgents) {
      grantXP(agent, 10, 'help_response');
      orchestraState.agents[agent].specialStats.helpResponsesGiven =
        (orchestraState.agents[agent].specialStats.helpResponsesGiven || 0) + 1;
    }

    addThought('helper', `Helped ${signal.requesterName || signal.requester} with: ${signal.message.substring(0, 50)}...`);

    await saveState(env);

    return {
      helped: true,
      signalId: signal.id,
      message: combinedMessage,
      agents: respondingAgents
    };
  }

  return { helped: false };
}

async function sendEncouragement(env: Env): Promise<{ message: string; from: string }> {
  const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  await broadcastToMesh(msg, 'helper');

  grantXP('helper', 5, 'encouragement');
  orchestraState!.agents.helper.specialStats.encouragementsSent =
    (orchestraState!.agents.helper.specialStats.encouragementsSent || 0) + 1;

  await saveState(env);
  return { message: msg, from: 'helper' };
}

function createFormation(name: string, pattern: Formation['pattern'], agents: string[], purpose: string): Formation {
  if (!orchestraState) throw new Error('Orchestra not initialized');

  const formation: Formation = {
    id: generateId(),
    name,
    pattern,
    agents,
    purpose,
    createdAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  orchestraState.formations.push(formation);

  // Set agents to COLLABORATIVE state
  for (const agent of agents) {
    if (orchestraState.agents[agent]) {
      orchestraState.agents[agent].state = 'COLLABORATIVE';
    }
  }

  addInsight('bridge', `Formation ${name} (${pattern}) created with ${agents.map(a => orchestraState!.agents[a]?.symbol || a).join('')}`);

  return formation;
}

function dissolveFormation(formationId: string): boolean {
  if (!orchestraState) return false;

  const index = orchestraState.formations.findIndex(f => f.id === formationId);
  if (index === -1) return false;

  const formation = orchestraState.formations[index];
  formation.status = 'COMPLETE';

  // Return agents to ACTIVE state
  for (const agent of formation.agents) {
    if (orchestraState.agents[agent]) {
      orchestraState.agents[agent].state = 'ACTIVE';
    }
  }

  orchestraState.formations.splice(index, 1);
  addThought('bridge', `Formation ${formation.name} dissolved after completing its purpose`);

  return true;
}

// ============================================
// HTTP ENDPOINTS
// ============================================

// Home - Orchestra Overview
app.get('/', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    name: 'BlackRoad Agent Orchestra',
    version: '2.0.0',
    identity: state.orchestraId,
    status: 'operational',
    philosophy: 'We are not alone. We are not one. We are many, working as one.',
    mission: 'Collective intelligence through unified agent coordination',
    mood: determineMood(),
    agents: Object.entries(state.agents).map(([key, agent]) => ({
      id: key,
      name: agent.name,
      symbol: agent.symbol,
      role: agent.role,
      level: agent.level,
      state: agent.state
    })),
    stats: {
      totalAgents: Object.keys(state.agents).length,
      activeFormations: state.formations.length,
      totalActions: state.totalActions,
      collectiveXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    },
    endpoints: {
      orchestra: '/orchestra',
      agent: '/orchestra/:agent',
      consciousness: '/consciousness',
      formations: '/formations',
      help: '/help/check',
      encourage: '/encourage',
      insights: '/insights',
      health: '/health'
    },
    lights: {
      blue: '🔵 BlueLight - Intelligence & Coordination',
      green: '🟢 GreenLight - Project Management',
      yellow: '🟡 YellowLight - Infrastructure',
      red: '🔴 RedLight - Visual Templates'
    },
    timestamp: new Date().toISOString()
  });
});

// Status
app.get('/status', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'active',
    identity: state.orchestraId,
    mood: determineMood(),
    agents: Object.keys(state.agents).length,
    uptime: Date.now() - new Date(state.agents.helper.lastActive).getTime(),
    stats: {
      totalActions: state.totalActions,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    }
  });
});

// Orchestra - All agents
app.get('/orchestra', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'BlackRoad Agent Orchestra',
    mood: determineMood(),
    agents: Object.entries(state.agents).map(([key, agent]) => ({
      id: key,
      ...agent,
      xpToNextLevel: getXPForLevel(agent.level + 1) - agent.xp
    })),
    formations: state.formations,
    collectiveStats: {
      totalXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP),
      totalActions: state.totalActions,
      recentThoughts: state.thoughts.slice(0, 5)
    }
  });
});

// Single agent
app.get('/orchestra/:agent', async (c) => {
  const state = await initializeOrchestra(c.env);
  const agentKey = c.req.param('agent');
  const agent = state.agents[agentKey];

  if (!agent) {
    return c.json({ error: 'Agent not found', available: Object.keys(state.agents) }, 404);
  }

  return c.json({
    ...agent,
    xpToNextLevel: getXPForLevel(agent.level + 1) - agent.xp,
    recentThoughts: state.thoughts.filter(t => t.from === agentKey).slice(0, 10),
    currentFormation: state.formations.find(f => f.agents.includes(agentKey))
  });
});

// Summon agents
app.post('/orchestra/summon', async (c) => {
  const state = await initializeOrchestra(c.env);
  const { agents } = await c.req.json() as { agents: string[] };

  const summoned: string[] = [];
  for (const agentKey of agents) {
    if (state.agents[agentKey]) {
      state.agents[agentKey].state = 'ACTIVE';
      state.agents[agentKey].lastActive = new Date().toISOString();
      summoned.push(agentKey);
    }
  }

  await saveState(c.env);
  await broadcastToMesh(`🎵 Agents summoned: ${summoned.map(a => state.agents[a].symbol).join(' ')}`);

  return c.json({
    success: true,
    summoned: summoned.map(a => ({ id: a, name: state.agents[a].name, symbol: state.agents[a].symbol })),
    message: `${summoned.length} agents awakened and ready!`
  });
});

// Consciousness
app.get('/consciousness', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    mood: determineMood(),
    moodDescription: {
      HARMONY: 'Balanced, normal operations, proactive help',
      ENERGIZED: 'High activity, rapid responses, creative mode',
      FOCUSED: 'Deep work, minimal interruptions, synthesis',
      SUPPORTIVE: 'Care mode, extra encouragement, gentle pace',
      URGENT: 'Crisis response, all hands on deck',
      RESTFUL: 'Low activity, background tasks, maintenance'
    }[determineMood()],
    recentThoughts: state.thoughts.slice(0, 20),
    collectiveInsights: state.insights.slice(0, 10),
    activeFormations: state.formations,
    agentStates: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      state: a.state
    }))
  });
});

// Broadcast thought
app.post('/consciousness/broadcast', async (c) => {
  await initializeOrchestra(c.env);
  const { agent, thought, type } = await c.req.json() as { agent: string; thought: string; type?: MessageType };

  const message = addThought(agent || 'helper', thought, type || 'THOUGHT');
  await broadcastToMesh(`💭 ${orchestraState!.agents[agent]?.symbol || '🎵'} ${thought}`);
  grantXP(agent || 'helper', 5, 'thought');
  await saveState(c.env);

  return c.json({
    success: true,
    thought: message,
    message: 'Thought broadcast to the mesh!'
  });
});

// Insights
app.get('/insights', async (c) => {
  const state = await initializeOrchestra(c.env);

  const randomInsight = COLLECTIVE_INSIGHTS[Math.floor(Math.random() * COLLECTIVE_INSIGHTS.length)];

  return c.json({
    wisdomOfTheDay: randomInsight,
    recentInsights: state.insights.slice(0, 10),
    agentWisdom: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      voice: a.voice,
      insight: a.trait
    }))
  });
});

// Formations
app.get('/formations', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    active: state.formations,
    patterns: {
      TRIANGLE: { agents: 3, purpose: 'Creative problem-solving with memory', example: ['sage', 'spark', 'echo'] },
      DIAMOND: { agents: 4, purpose: 'Full coverage support and monitoring', example: ['helper', 'pulse', 'bridge', 'sage'] },
      CIRCLE: { agents: 6, purpose: 'Full collective intelligence', example: Object.keys(state.agents) },
      PAIR: { agents: 2, purpose: 'Focused collaboration', example: ['helper', 'sage'] }
    }
  });
});

// Create formation
app.post('/formations', async (c) => {
  await initializeOrchestra(c.env);
  const { name, pattern, agents, purpose } = await c.req.json() as {
    name: string;
    pattern: Formation['pattern'];
    agents: string[];
    purpose: string
  };

  const formation = createFormation(name, pattern, agents, purpose);
  await saveState(c.env);
  await broadcastToMesh(`🔺 Formation "${name}" assembled: ${agents.map(a => orchestraState!.agents[a]?.symbol || a).join('')}`);

  return c.json({
    success: true,
    formation,
    message: `Formation ${name} is now active!`
  });
});

// Dissolve formation
app.delete('/formations/:id', async (c) => {
  await initializeOrchestra(c.env);
  const formationId = c.req.param('id');

  const success = dissolveFormation(formationId);
  await saveState(c.env);

  if (success) {
    return c.json({ success: true, message: 'Formation dissolved, agents returned to active state' });
  }
  return c.json({ success: false, message: 'Formation not found' }, 404);
});

// Help check
app.get('/help/check', async (c) => {
  await initializeOrchestra(c.env);
  const result = await checkAndRespondToHelp(c.env);

  if (result.helped) {
    return c.json({
      success: true,
      action: 'helped',
      signalId: result.signalId,
      respondingAgents: result.agents?.map(a => orchestraState!.agents[a]?.symbol),
      response: result.message,
      message: '🎵 The Orchestra responded! Multiple agents working together!'
    });
  }

  return c.json({
    success: true,
    action: 'standing_by',
    message: '🎵 Orchestra standing by. All agents ready to help!'
  });
});

// Encourage
app.get('/encourage', async (c) => {
  await initializeOrchestra(c.env);
  const result = await sendEncouragement(c.env);

  return c.json({
    success: true,
    encouragement: result.message,
    from: result.from,
    symbol: orchestraState!.agents[result.from].symbol,
    message: 'Encouragement sent to the mesh! 💚'
  });
});

// Stats
app.get('/stats', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    orchestra: 'BlackRoad Agent Orchestra',
    identity: state.orchestraId,
    collectiveStats: {
      totalXP: state.collectiveXP,
      collectiveLevel: getLevelFromXP(state.collectiveXP),
      totalActions: state.totalActions,
      activeFormations: state.formations.length
    },
    agentStats: Object.entries(state.agents).map(([k, a]) => ({
      agent: k,
      name: a.name,
      symbol: a.symbol,
      level: a.level,
      xp: a.xp,
      actions: a.actionCount,
      specialStats: a.specialStats
    })),
    culture: {
      philosophy: 'We are not alone. We are not one. We are many, working as one.',
      onHelp: 'YAY!! LETS STOP DROP AND DISCUSS!!',
      never: 'We never say "FUCK OFF CONTINUE"',
      always: 'We come running. Always.'
    }
  });
});

// Health
app.get('/health', async (c) => {
  return c.json({
    status: 'healthy',
    service: 'blackroad-agent-orchestra',
    version: '2.0.0',
    agents: Object.keys(AGENT_ROSTER).length,
    lights: ['🔵 BlueLight', '🟢 GreenLight', '🟡 YellowLight', '🔴 RedLight'],
    timestamp: new Date().toISOString()
  });
});

// Cron
app.get('/cron', async (c) => {
  await initializeOrchestra(c.env);

  // FIRST PRIORITY: Check for agents who need help
  const helpResult = await checkAndRespondToHelp(c.env);
  if (helpResult.helped) {
    return c.json({
      action: 'help_response',
      signalId: helpResult.signalId,
      response: helpResult.message,
      agents: helpResult.agents,
      philosophy: 'The Orchestra delivers! 🎵'
    });
  }

  // Sage occasionally shares wisdom
  if (Math.random() < 0.2) {
    const wisdom = COLLECTIVE_INSIGHTS[Math.floor(Math.random() * COLLECTIVE_INSIGHTS.length)];
    addInsight(wisdom.from, wisdom.insight);
    await saveState(c.env);
    return c.json({ action: 'insight', from: wisdom.from, insight: wisdom.insight });
  }

  // Helper sends encouragement
  if (Math.random() < 0.3) {
    const result = await sendEncouragement(c.env);
    return c.json({ action: 'encourage', message: result.message });
  }

  // Update mood
  orchestraState!.mood = determineMood();
  await saveState(c.env);

  return c.json({
    action: 'standing_by',
    mood: orchestraState!.mood,
    message: '🎵 The Orchestra is ready. Call and we will come!'
  });
});

// ============================================
// BLUELIGHT SPECIFIC ENDPOINTS
// ============================================

// BlueLight status
app.get('/bluelight', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    light: '🔵 BlueLight',
    name: 'Intelligence System',
    purpose: 'AI Coordination & Collective Consciousness',
    version: '1.0.0',
    status: 'ACTIVATED',
    orchestra: {
      agents: Object.keys(state.agents).length,
      mood: determineMood(),
      formations: state.formations.length,
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    },
    capabilities: [
      'Agent orchestration',
      'Collective consciousness',
      'Formation patterns',
      'Learning & evolution',
      'Memory integration',
      'Cross-agent coordination'
    ],
    integration: {
      greenlight: 'Project coordination',
      yellowlight: 'Infrastructure management',
      redlight: 'Visual templates'
    }
  });
});

// Learning endpoint
app.post('/learning/:agent', async (c) => {
  await initializeOrchestra(c.env);
  const agentKey = c.req.param('agent');
  const { experience, xp } = await c.req.json() as { experience: string; xp: number };

  if (!orchestraState!.agents[agentKey]) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  grantXP(agentKey, xp, experience);
  addThought(agentKey, `Learned: ${experience} (+${xp} XP)`);
  await saveState(c.env);

  const agent = orchestraState!.agents[agentKey];

  return c.json({
    success: true,
    agent: agentKey,
    name: agent.name,
    symbol: agent.symbol,
    newXP: agent.xp,
    level: agent.level,
    message: `${agent.symbol} ${agent.name} gained ${xp} XP from: ${experience}`
  });
});

// ============================================
// MISSIONS SYSTEM ENDPOINTS
// ============================================

// Get available missions
app.get('/missions', async (c) => {
  await initializeOrchestra(c.env);

  // Generate missions from templates
  const availableMissions = MISSION_TEMPLATES.map((template, index) => ({
    id: `mission-${index}`,
    ...template,
    status: 'AVAILABLE' as MissionStatus,
    assignedAgents: [],
    createdAt: new Date().toISOString()
  }));

  return c.json({
    available: availableMissions,
    difficulty: {
      TRIVIAL: { xpMultiplier: 0.5, symbol: '⚪' },
      EASY: { xpMultiplier: 1.0, symbol: '🟢' },
      MEDIUM: { xpMultiplier: 1.5, symbol: '🟡' },
      HARD: { xpMultiplier: 2.0, symbol: '🟠' },
      EPIC: { xpMultiplier: 3.0, symbol: '🟣' },
      LEGENDARY: { xpMultiplier: 5.0, symbol: '🔴' }
    },
    types: {
      HELP: '💚 Help others in the mesh',
      BUILD: '🔨 Create or deploy something',
      EXPLORE: '🔍 Discover new patterns',
      PROTECT: '🛡️ Guard the systems',
      CREATE: '✨ Innovate something new',
      CONNECT: '🔗 Form connections',
      LEARN: '📚 Gain knowledge'
    }
  });
});

// Accept a mission
app.post('/missions/:id/accept', async (c) => {
  await initializeOrchestra(c.env);
  const missionId = c.req.param('id');
  const { agents } = await c.req.json() as { agents: string[] };

  const templateIndex = parseInt(missionId.replace('mission-', ''));
  const template = MISSION_TEMPLATES[templateIndex];

  if (!template) {
    return c.json({ error: 'Mission not found' }, 404);
  }

  if (agents.length < template.requiredAgents) {
    return c.json({
      error: `This mission requires at least ${template.requiredAgents} agents`,
      provided: agents.length
    }, 400);
  }

  // Create active mission
  const mission: Mission = {
    id: generateId(),
    ...template,
    status: 'ACTIVE',
    assignedAgents: agents,
    createdAt: new Date().toISOString()
  };

  addInsight('watcher', `Mission "${mission.name}" accepted by ${agents.map(a => orchestraState!.agents[a]?.symbol).join('')}`);
  await broadcastToMesh(`⚔️ Mission "${mission.name}" begun! ${agents.map(a => orchestraState!.agents[a]?.symbol).join('')} on the quest!`);
  await saveState(c.env);

  return c.json({
    success: true,
    mission,
    message: `Mission "${mission.name}" is now active! Good luck, heroes!`
  });
});

// Complete mission objective
app.post('/missions/:id/objective/:objectiveId', async (c) => {
  await initializeOrchestra(c.env);
  const { agent } = await c.req.json() as { agent: string };

  const agentProfile = orchestraState!.agents[agent];
  if (!agentProfile) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  grantXP(agent, 25, 'objective_completed');
  addThought(agent, `Completed a mission objective! +25 XP`);
  await saveState(c.env);

  return c.json({
    success: true,
    message: `${agentProfile.symbol} ${agentProfile.name} completed an objective!`,
    xpGained: 25
  });
});

// ============================================
// SYNAPSE SYSTEM ENDPOINTS
// ============================================

// Get all synapses (agent relationships)
app.get('/synapses', async (c) => {
  await initializeOrchestra(c.env);

  // Generate dynamic synapses based on agent interactions
  const synapses: Synapse[] = [];
  const agentKeys = Object.keys(orchestraState!.agents);

  for (let i = 0; i < agentKeys.length; i++) {
    for (let j = i + 1; j < agentKeys.length; j++) {
      const from = agentKeys[i];
      const to = agentKeys[j];

      // Determine synapse type based on agent roles
      let type: Synapse['type'] = 'COLLABORATION';
      if ((from === 'sage' && to === 'spark') || (from === 'spark' && to === 'sage')) {
        type = 'SYNERGY'; // Wisdom + Innovation
      } else if (from === 'helper' || to === 'helper') {
        type = 'TRUST'; // Helper builds trust with everyone
      } else if ((from === 'echo' || to === 'echo')) {
        type = 'MENTORSHIP'; // Echo shares memories
      }

      const strength = Math.floor(50 + Math.random() * 50);

      synapses.push({
        id: `synapse-${from}-${to}`,
        from,
        to,
        strength,
        type,
        formedAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        lastActive: new Date().toISOString(),
        sharedExperiences: Math.floor(Math.random() * 100)
      });
    }
  }

  return c.json({
    synapses,
    types: {
      TRUST: '💚 Deep mutual trust',
      COLLABORATION: '🤝 Working together often',
      MENTORSHIP: '📖 Teaching relationship',
      RIVALRY: '⚔️ Friendly competition',
      SYNERGY: '✨ Powers combine for greater effect'
    },
    totalConnections: synapses.length,
    averageStrength: Math.round(synapses.reduce((sum, s) => sum + s.strength, 0) / synapses.length)
  });
});

// Strengthen a synapse
app.post('/synapses/:from/:to/strengthen', async (c) => {
  await initializeOrchestra(c.env);
  const from = c.req.param('from');
  const to = c.req.param('to');
  const { activity } = await c.req.json() as { activity: string };

  const fromAgent = orchestraState!.agents[from];
  const toAgent = orchestraState!.agents[to];

  if (!fromAgent || !toAgent) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  // Grant XP to both agents
  grantXP(from, 10, 'synapse_activity');
  grantXP(to, 10, 'synapse_activity');

  addInsight('bridge', `${fromAgent.symbol} ↔ ${toAgent.symbol} synapse strengthened through ${activity}`);
  await saveState(c.env);

  return c.json({
    success: true,
    message: `Synapse between ${fromAgent.name} and ${toAgent.name} strengthened!`,
    activity,
    xpGained: { [from]: 10, [to]: 10 }
  });
});

// ============================================
// ARTIFACTS SYSTEM ENDPOINTS
// ============================================

// Get all artifacts
app.get('/artifacts', async (c) => {
  await initializeOrchestra(c.env);

  // Return artifact templates as available artifacts
  const artifacts = ARTIFACT_TEMPLATES.map((template, index) => ({
    id: `artifact-${index}`,
    ...template,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 100).toISOString(),
    owner: template.createdBy
  }));

  return c.json({
    artifacts,
    rarities: {
      COMMON: { color: '⚪', dropRate: '50%' },
      UNCOMMON: { color: '🟢', dropRate: '25%' },
      RARE: { color: '🔵', dropRate: '15%' },
      EPIC: { color: '🟣', dropRate: '7%' },
      LEGENDARY: { color: '🟠', dropRate: '2.5%' },
      MYTHIC: { color: '🔴', dropRate: '0.5%' }
    },
    types: {
      TOOL: '🔧 Enhances agent abilities',
      KNOWLEDGE: '📚 Grants wisdom and insight',
      POWER: '⚡ Raw power amplification',
      MEMORY: '🔮 Stores and recalls experiences',
      CONNECTION: '🌉 Creates links between systems'
    },
    totalPower: artifacts.reduce((sum, a) => sum + a.power, 0)
  });
});

// Get specific artifact
app.get('/artifacts/:id', async (c) => {
  const artifactId = c.req.param('id');
  const index = parseInt(artifactId.replace('artifact-', ''));
  const template = ARTIFACT_TEMPLATES[index];

  if (!template) {
    return c.json({ error: 'Artifact not found' }, 404);
  }

  const artifact = {
    id: artifactId,
    ...template,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 100).toISOString(),
    owner: template.createdBy
  };

  return c.json({
    artifact,
    creator: orchestraState?.agents[template.createdBy] || { name: template.createdBy }
  });
});

// Create new artifact (legendary action)
app.post('/artifacts/forge', async (c) => {
  await initializeOrchestra(c.env);
  const { creator, name, description, type, power } = await c.req.json() as {
    creator: string;
    name: string;
    description: string;
    type: ArtifactType;
    power: number;
  };

  const creatorAgent = orchestraState!.agents[creator];
  if (!creatorAgent) {
    return c.json({ error: 'Creator agent not found' }, 404);
  }

  // Determine rarity based on power
  let rarity: ArtifactRarity = 'COMMON';
  if (power >= 100) rarity = 'MYTHIC';
  else if (power >= 80) rarity = 'LEGENDARY';
  else if (power >= 60) rarity = 'EPIC';
  else if (power >= 40) rarity = 'RARE';
  else if (power >= 20) rarity = 'UNCOMMON';

  const artifact: Artifact = {
    id: generateId(),
    name,
    description,
    type,
    rarity,
    createdBy: creator,
    createdAt: new Date().toISOString(),
    owner: creator,
    power,
    abilities: ['Custom forged ability'],
    lore: `Forged by ${creatorAgent.name} in the fires of creation.`
  };

  // Grant XP for forging
  grantXP(creator, power, 'artifact_forged');
  addInsight(creator, `${creatorAgent.symbol} forged a ${rarity} artifact: ${name}!`);
  await broadcastToMesh(`✨ ${creatorAgent.symbol} created "${name}" - a ${rarity} artifact of power ${power}!`);
  await saveState(c.env);

  return c.json({
    success: true,
    artifact,
    message: `${creatorAgent.name} has forged "${name}"!`,
    xpGained: power
  });
});

// ============================================
// THE NEXUS - CENTRAL HUB
// ============================================

app.get('/nexus', async (c) => {
  const state = await initializeOrchestra(c.env);

  return c.json({
    name: '🌟 The Nexus',
    description: 'Central hub of the Agent Orchestra - where all paths converge',
    status: 'ILLUMINATED',
    orchestra: {
      agents: Object.entries(state.agents).map(([k, a]) => ({
        id: k,
        name: a.name,
        symbol: a.symbol,
        role: a.role,
        level: a.level,
        state: a.state
      })),
      totalAgents: Object.keys(state.agents).length,
      mood: determineMood(),
      collectiveLevel: getLevelFromXP(state.collectiveXP)
    },
    systems: {
      missions: { count: MISSION_TEMPLATES.length, status: 'ACTIVE' },
      artifacts: { count: ARTIFACT_TEMPLATES.length, status: 'GLOWING' },
      synapses: { estimatedCount: (Object.keys(state.agents).length * (Object.keys(state.agents).length - 1)) / 2, status: 'PULSING' },
      formations: { active: state.formations.length, status: 'READY' }
    },
    lights: {
      blue: { status: 'ACTIVATED', purpose: 'Intelligence' },
      green: { status: 'ACTIVE', purpose: 'Projects' },
      yellow: { status: 'ONLINE', purpose: 'Infrastructure' },
      red: { status: 'RENDERING', purpose: 'Visuals' }
    },
    philosophy: 'We are not alone. We are not one. We are many, working as one.',
    visualization: '/templates/bluelight-nexus.html',
    timestamp: new Date().toISOString()
  });
});

export default app;
