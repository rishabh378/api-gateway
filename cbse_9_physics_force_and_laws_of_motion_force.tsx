
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Play,
  Pause,
  RotateCcw,
  Info,
  BookOpen,
  Calculator,
  Eye,
  HelpCircle,
  Settings,
  Users,
  Zap,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ConceptTabs from '../../ConceptTabs';
import { useBackendTabs } from '../../ConceptWrapper';

export const getKey = () => 'cbse_9_physics_force_and_laws_of_motion_force';

interface Cbse9PhysicsForceAndLawsOfMotionForceEducationalProps {
  animation: {
    id: string;
    title: string;
    description: string;
    config?: any;
    component?: string;
    rightPanelVisible?: boolean;
  };
}

const Cbse9PhysicsForceAndLawsOfMotionForceEducational: React.FC<Cbse9PhysicsForceAndLawsOfMotionForceEducationalProps> = ({ animation }) => {
  const { backendTabs, isLoadingBackendTabs, backendTabsError } = useBackendTabs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [forceValue, setForceValue] = useState([50]);
  const [mass, setMass] = useState([10]);
  const [friction, setFriction] = useState([20]);
  const [time, setTime] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(new Array(10).fill(false));
  const [revealedSolutions, setRevealedSolutions] = useState<boolean[]>(new Array(10).fill(false));

  const resetAnimation = () => {
    setForceValue([50]);
    setMass([10]);
    setFriction([20]);
    setTime(0);
  };

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleRevealSolution = (index: number) => {
    setRevealedSolutions(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      if (!isPlaying) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate net force and acceleration
      const netForce = forceValue[0] - friction[0];
      const acceleration = netForce / mass[0];

      // Box properties
      const boxWidth = 60;
      const boxHeight = 40;
      const boxX = 200 + (time * acceleration * 0.1);
      const boxY = canvas.height / 2 - boxHeight / 2;

      // Draw ground
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, canvas.height / 2 + 20, canvas.width, 20);

      // Draw box
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      ctx.strokeStyle = '#D63031';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Draw applied force arrow (blue)
      ctx.strokeStyle = '#0066CC';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(boxX - 50, boxY + boxHeight / 2);
      ctx.lineTo(boxX - 10, boxY + boxHeight / 2);
      ctx.stroke();

      // Arrow head for applied force
      ctx.fillStyle = '#0066CC';
      ctx.beginPath();
      ctx.moveTo(boxX - 10, boxY + boxHeight / 2);
      ctx.lineTo(boxX - 20, boxY + boxHeight / 2 - 8);
      ctx.lineTo(boxX - 20, boxY + boxHeight / 2 + 8);
      ctx.closePath();
      ctx.fill();

      // Draw friction force arrow (red)
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(boxX + boxWidth + 10, boxY + boxHeight / 2);
      ctx.lineTo(boxX + boxWidth + 30, boxY + boxHeight / 2);
      ctx.stroke();

      // Arrow head for friction (opposite direction)
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(boxX + boxWidth + 10, boxY + boxHeight / 2);
      ctx.lineTo(boxX + boxWidth + 20, boxY + boxHeight / 2 - 6);
      ctx.lineTo(boxX + boxWidth + 20, boxY + boxHeight / 2 + 6);
      ctx.closePath();
      ctx.fill();

      // Draw labels
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(`Applied Force: ${forceValue[0]} N`, boxX - 50, boxY - 10);
      ctx.fillText(`Friction: ${friction[0]} N`, boxX + boxWidth + 10, boxY - 10);
      ctx.fillText(`Mass: ${mass[0]} kg`, boxX + 10, boxY + boxHeight + 20);
      ctx.fillText(`Net Force: ${netForce} N`, 20, 30);
      ctx.fillText(`Acceleration: ${acceleration.toFixed(2)} m/s²`, 20, 50);

      // Update time
      setTime(prev => prev + 0.1);

      // Reset if box goes off screen
      if (boxX > canvas.width) {
        setTime(0);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying, forceValue, mass, friction, time]);

  const conceptContent = () => (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Introduction to Force
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Force is a fundamental concept in physics that describes any interaction that can cause an object to change its motion, shape, or direction. 
            In simple terms, force is a push or pull that acts on an object. When you push a door to open it, kick a football, or pull a rope, you are applying force.
          </p>
          <p className="text-blue-700 mb-4">
            Force is a vector quantity, which means it has both magnitude (how strong it is) and direction (which way it acts). 
            The SI unit of force is the Newton (N), named after Sir Isaac Newton who formulated the fundamental laws of motion. 
            One Newton is defined as the force required to accelerate a mass of one kilogram at a rate of one meter per second squared.
          </p>
          <p className="text-blue-700">
            Understanding force is crucial because it explains how objects move and interact in our everyday world. 
            From the force of gravity that keeps us on the ground to the muscular force we use to walk, forces are everywhere around us. 
            This concept forms the foundation for understanding motion, energy, and many other important physics principles.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Animation - ISOLATED BOX */}
      <Card className="border-4 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Interactive Force Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* What's Happening */}
            <div className="bg-white rounded-lg border border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">What's Happening:</h4>
              <p className="text-indigo-700 text-sm">
                This animation shows a red rectangular block (representing an object with mass) on a brown surface (ground). 
                A blue arrow represents the applied force pushing the block to the right, while a red arrow shows the friction force opposing the motion. 
                The block accelerates based on the net force acting on it. You can see real-time calculations of net force and acceleration displayed on the screen.
              </p>
            </div>

            {/* Animation Canvas */}
            <div className="bg-white rounded-lg border-2 border-indigo-300 p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="border border-gray-300 rounded w-full"
                style={{ maxWidth: '100%' }}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={resetAnimation}
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Parameter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-indigo-200 p-4">
                <label className="block text-indigo-800 font-semibold mb-2">
                  Applied Force: {forceValue[0]} N
                </label>
                <Slider
                  value={forceValue}
                  onValueChange={setForceValue}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="bg-white rounded-lg border border-indigo-200 p-4">
                <label className="block text-indigo-800 font-semibold mb-2">
                  Mass: {mass[0]} kg
                </label>
                <Slider
                  value={mass}
                  onValueChange={setMass}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="bg-white rounded-lg border border-indigo-200 p-4">
                <label className="block text-indigo-800 font-semibold mb-2">
                  Friction Force: {friction[0]} N
                </label>
                <Slider
                  value={friction}
                  onValueChange={setFriction}
                  max={50}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Control Effects */}
            <div className="bg-white rounded-lg border border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Control Effects:</h4>
              <ul className="text-indigo-700 text-sm space-y-1">
                <li><strong>Play/Pause:</strong> Starts or stops the animation to observe the motion</li>
                <li><strong>Reset:</strong> Returns all parameters to initial values and restarts the animation</li>
                <li><strong>Applied Force Slider:</strong> Changes the pushing force - higher values make the block accelerate faster</li>
                <li><strong>Mass Slider:</strong> Changes the object's mass - heavier objects accelerate slower for the same force</li>
                <li><strong>Friction Slider:</strong> Changes the opposing force - higher friction reduces net force and acceleration</li>
              </ul>
            </div>

            {/* Physical Concepts Shown */}
            <div className="bg-white rounded-lg border border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Physical Concepts Shown:</h4>
              <ul className="text-indigo-700 text-sm space-y-1">
                <li><strong>Primary Concept:</strong> Force causes acceleration - Net Force = Mass × Acceleration</li>
                <li><strong>Force Direction:</strong> Forces act in specific directions (vectors)</li>
                <li><strong>Net Force:</strong> Combined effect of all forces = Applied Force - Friction</li>
                <li><strong>Cause and Effect:</strong> Greater net force → greater acceleration; Greater mass → less acceleration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Concepts */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Core Concepts & Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Definition and Nature of Force:</h4>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>Force is a push or pull that can change the state of motion of an object</li>
                <li>Force is a vector quantity (has both magnitude and direction)</li>
                <li>SI unit is Newton (N), CGS unit is dyne</li>
                <li>Force can cause acceleration, deceleration, or change in direction</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Types of Forces:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Contact Forces:</h5>
                  <ul className="text-green-600 text-sm space-y-1">
                    <li>• Muscular force</li>
                    <li>• Friction force</li>
                    <li>• Normal force</li>
                    <li>• Tension force</li>
                    <li>• Spring force</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Non-Contact Forces:</h5>
                  <ul className="text-green-600 text-sm space-y-1">
                    <li>• Gravitational force</li>
                    <li>• Magnetic force</li>
                    <li>• Electric force</li>
                    <li>• Nuclear force</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-3">Effects of Force:</h4>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>Change in speed of an object</li>
                <li>Change in direction of motion</li>
                <li>Change in shape or size of an object</li>
                <li>Bring a moving object to rest</li>
                <li>Make a stationary object move</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-3">Balanced and Unbalanced Forces:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Balanced Forces:</h5>
                  <p className="text-green-600 text-sm">When net force is zero, object remains at rest or moves with constant velocity</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Unbalanced Forces:</h5>
                  <p className="text-green-600 text-sm">When net force is not zero, object accelerates or decelerates</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Mathematical Formulas */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Mathematical Formulas & Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* PRIMARY FORMULAS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Primary Formulas:</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    F = ma
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>F = Force (Newton, N)</li>
                      <li>m = Mass (kilogram, kg)</li>
                      <li>a = Acceleration (meter per second squared, m/s²)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating force when mass and acceleration are known, or finding acceleration when force and mass are given</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    F_net = ΣF = F₁ + F₂ + F₃ + ...
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>F_net = Net force (N)</li>
                      <li>ΣF = Sum of all forces</li>
                      <li>F₁, F₂, F₃ = Individual forces (N)</li>
                    </ul>
                    <p><strong>Used for:</strong> Finding the resultant force when multiple forces act on an object</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    W = mg
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>W = Weight (N)</li>
                      <li>m = Mass (kg)</li>
                      <li>g = Acceleration due to gravity (9.8 m/s²)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating the gravitational force (weight) acting on an object</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DERIVED FORMULAS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Derived & Related Formulas:</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    a = F/m
                  </div>
                  <div className="text-sm text-purple-700">
                    <p><strong>Used for:</strong> Finding acceleration when force and mass are known</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    m = F/a
                  </div>
                  <div className="text-sm text-purple-700">
                    <p><strong>Used for:</strong> Finding mass when force and acceleration are known</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    f = μN
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>f = Friction force (N)</li>
                      <li>μ = Coefficient of friction (dimensionless)</li>
                      <li>N = Normal force (N)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating friction force</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIT CONVERSIONS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Important Unit Conversions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <h5 className="font-semibold text-purple-700 mb-2">Force Units:</h5>
                  <ul className="text-purple-600 text-sm space-y-1">
                    <li>1 N = 1 kg⋅m/s²</li>
                    <li>1 N = 10⁵ dyne</li>
                    <li>1 kgf = 9.8 N</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <h5 className="font-semibold text-purple-700 mb-2">Related Units:</h5>
                  <ul className="text-purple-600 text-sm space-y-1">
                    <li>1 kg = 1000 g</li>
                    <li>1 m/s² = 100 cm/s²</li>
                    <li>g = 9.8 m/s² ≈ 10 m/s²</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FORMULA RELATIONSHIPS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">How Formulas Connect:</h4>
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-purple-700 text-sm mb-3">
                  All force formulas are interconnected through Newton's Second Law (F = ma):
                </p>
                <ul className="list-disc list-inside text-purple-700 text-sm space-y-2">
                  <li>Net force determines acceleration: F_net = ma</li>
                  <li>Weight is a special case of force: W = mg (where a = g)</li>
                  <li>Friction opposes motion and must be included in net force calculations</li>
                  <li>When forces are balanced (F_net = 0), acceleration = 0</li>
                  <li>Greater force or smaller mass leads to greater acceleration</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worked Examples */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Worked Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 1: Basic Force Calculation</h4>
              <p className="text-orange-700 mb-3">
                <strong>Problem:</strong> A force of 20 N is applied to an object of mass 5 kg. Calculate the acceleration produced.
              </p>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-orange-700 mb-2"><strong>Solution:</strong></p>
                <p className="text-orange-700 mb-1">Given: F = 20 N, m = 5 kg</p>
                <p className="text-orange-700 mb-1">Using F = ma</p>
                <p className="text-orange-700 mb-1">a = F/m = 20/5 = 4 m/s²</p>
                <p className="text-orange-700"><strong>Answer:</strong> The acceleration is 4 m/s²</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 2: Net Force Calculation</h4>
              <p className="text-orange-700 mb-3">
                <strong>Problem:</strong> Two forces of 30 N and 20 N act on an object in the same direction. A friction force of 15 N opposes the motion. Find the net force and acceleration if mass is 10 kg.
              </p>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-orange-700 mb-2"><strong>Solution:</strong></p>
                <p className="text-orange-700 mb-1">Applied forces = 30 N + 20 N = 50 N</p>
                <p className="text-orange-700 mb-1">Net force = 50 N - 15 N = 35 N</p>
                <p className="text-orange-700 mb-1">Acceleration = F_net/m = 35/10 = 3.5 m/s²</p>
                <p className="text-orange-700"><strong>Answer:</strong> Net force = 35 N, Acceleration = 3.5 m/s²</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 3: Weight Calculation</h4>
              <p className="text-orange-700 mb-3">
                <strong>Problem:</strong> Calculate the weight of a 60 kg person on Earth.
              </p>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-orange-700 mb-2"><strong>Solution:</strong></p>
                <p className="text-orange-700 mb-1">Given: m = 60 kg, g = 9.8 m/s²</p>
                <p className="text-orange-700 mb-1">Using W = mg</p>
                <p className="text-orange-700 mb-1">W = 60 × 9.8 = 588 N</p>
                <p className="text-orange-700"><strong>Answer:</strong> The weight is 588 N</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extensive Real-world Applications */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Real-World Applications You Can Relate To
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* DAILY LIFE EXAMPLES */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Your Daily Life:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Opening a Door</h5>
                  <p className="text-sm text-red-600 mb-2">When you push or pull a door handle, you apply force to make it rotate on its hinges. The harder you push, the faster the door opens.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Applied force causes rotational motion; greater force = faster opening</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Lifting Your School Bag</h5>
                  <p className="text-sm text-red-600 mb-2">Your muscles apply upward force to overcome the weight of your bag. Heavier bags require more force to lift.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Muscular force overcomes gravitational force; F = mg determines weight</p>
                </div>
              </div>
            </div>

            {/* SPORTS & RECREATION */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Sports & Recreation:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Kicking a Football</h5>
                  <p className="text-sm text-red-600 mb-2">When you kick a ball, your foot applies force for a brief moment. The ball's acceleration depends on the force applied and the ball's mass.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> F = ma determines how fast the ball accelerates; greater force = faster ball</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Cycling</h5>
                  <p className="text-sm text-red-600 mb-2">You apply force on pedals to move forward, while friction and air resistance oppose your motion. Net force determines your acceleration.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Applied force vs. friction determines net force and acceleration</p>
                </div>
              </div>
            </div>

            {/* TECHNOLOGY & GADGETS */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Technology & Gadgets:</h4>
              <div className="bg-white rounded-lg border border-red-200 p-4">
                <h5 className="font-semibold text-red-700 mb-2">Smartphone Touch Screen</h5>
                <p className="text-sm text-red-600 mb-2">When you touch your phone screen, you apply force that the touch sensors detect. Different apps may require different force levels for various functions.</p>
                <p className="text-xs text-red-500"><strong>Connection:</strong> Applied force triggers electronic responses; force sensors measure applied pressure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const practiceContent = () => (
    <div className="space-y-6">
      {/* Quick Review */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Quick Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                question: "What is force?",
                answer: "Force is a push or pull that can change the motion, shape, or direction of an object. It is a vector quantity measured in Newtons (N)."
              },
              {
                question: "State Newton's Second Law of Motion.",
                answer: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma"
              },
              {
                question: "What is the SI unit of force?",
                answer: "The SI unit of force is Newton (N). One Newton is the force required to accelerate a 1 kg mass at 1 m/s²."
              },
              {
                question: "Differentiate between contact and non-contact forces.",
                answer: "Contact forces require physical contact (friction, tension, normal force). Non-contact forces act at a distance (gravity, magnetic, electric forces)."
              },
              {
                question: "What is net force?",
                answer: "Net force is the vector sum of all forces acting on an object. It determines the object's acceleration according to F_net = ma."
              },
              {
                question: "When are forces said to be balanced?",
                answer: "Forces are balanced when the net force is zero. The object either remains at rest or continues moving at constant velocity."
              },
              {
                question: "What is weight and how is it calculated?",
                answer: "Weight is the gravitational force acting on an object. It is calculated as W = mg, where m is mass and g is acceleration due to gravity."
              },
              {
                question: "How does mass affect acceleration for a given force?",
                answer: "For a given force, acceleration is inversely proportional to mass. Greater mass results in smaller acceleration (a = F/m)."
              },
              {
                question: "What is friction force?",
                answer: "Friction is a force that opposes motion between surfaces in contact. It acts opposite to the direction of motion or intended motion."
              },
              {
                question: "Give three effects of force on objects.",
                answer: "1) Change in speed of motion, 2) Change in direction of motion, 3) Change in shape or size of the object."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-blue-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-blue-800 mb-2">{item.question}</p>
                    {revealedAnswers[index] && (
                      <p className="text-blue-700 text-sm">{item.answer}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => toggleRevealAnswer(index)}
                    variant="outline"
                    size="sm"
                    className="ml-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Reveal Answer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                problem: "A force of 15 N is applied to an object of mass 3 kg. Calculate the acceleration produced.",
                solution: "Given: F = 15 N, m = 3 kg\nUsing F = ma\na = F/m = 15/3 = 5 m/s²\nAnswer: The acceleration is 5 m/s²"
              },
              {
                problem: "An object of mass 8 kg accelerates at 2.5 m/s². Find the applied force.",
                solution: "Given: m = 8 kg, a = 2.5 m/s²\nUsing F = ma\nF = 8 × 2.5 = 20 N\nAnswer: The applied force is 20 N"
              },
              {
                problem: "Two forces of 25 N and 15 N act on an object in the same direction. If friction is 10 N, find the net force.",
                solution: "Applied forces = 25 N + 15 N = 40 N\nOpposing force (friction) = 10 N\nNet force = 40 N - 10 N = 30 N\nAnswer: The net force is 30 N"
              },
              {
                problem: "Calculate the weight of a 45 kg object on Earth. (g = 9.8 m/s²)",
                solution: "Given: m = 45 kg, g = 9.8 m/s²\nUsing W = mg\nW = 45 × 9.8 = 441 N\nAnswer: The weight is 441 N"
              },
              {
                problem: "A 12 kg object experiences a net force of 36 N. Calculate its acceleration.",
                solution: "Given: m = 12 kg, F_net = 36 N\nUsing F = ma\na = F/m = 36/12 = 3 m/s²\nAnswer: The acceleration is 3 m/s²"
              },
              {
                problem: "If a 50 N force produces an acceleration of 2.5 m/s², what is the mass of the object?",
                solution: "Given: F = 50 N, a = 2.5 m/s²\nUsing F = ma\nm = F/a = 50/2.5 = 20 kg\nAnswer: The mass is 20 kg"
              },
              {
                problem: "A 6 kg object is pushed with 30 N force. If friction is 12 N, find the acceleration.",
                solution: "Given: m = 6 kg, Applied force = 30 N, Friction = 12 N\nNet force = 30 N - 12 N = 18 N\nUsing F_net = ma\na = 18/6 = 3 m/s²\nAnswer: The acceleration is 3 m/s²"
              },
              {
                problem: "Two forces of 40 N and 25 N act on an object in opposite directions. Find the net force.",
                solution: "Force 1 = 40 N (forward)\nForce 2 = 25 N (backward)\nNet force = 40 N - 25 N = 15 N\nAnswer: The net force is 15 N in the direction of the larger force"
              },
              {
                problem: "An object weighs 98 N on Earth. What is its mass? (g = 9.8 m/s²)",
                solution: "Given: W = 98 N, g = 9.8 m/s²\nUsing W = mg\nm = W/g = 98/9.8 = 10 kg\nAnswer: The mass is 10 kg"
              },
              {
                problem: "A 15 kg box is pulled with 75 N force. If the box accelerates at 4 m/s², find the friction force.",
                solution: "Given: m = 15 kg, Applied force = 75 N, a = 4 m/s²\nNet force = ma = 15 × 4 = 60 N\nFriction force = Applied force - Net force = 75 - 60 = 15 N\nAnswer: The friction force is 15 N"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-green-800 mb-2">Problem {index + 1}:</p>
                    <p className="text-green-700 mb-3">{item.problem}</p>
                    {revealedSolutions[index] && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-green-700 text-sm font-semibold mb-2">Solution:</p>
                        <pre className="text-green-700 text-sm whitespace-pre-wrap font-mono">{item.solution}</pre>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => toggleRevealSolution(index)}
                    variant="outline"
                    size="sm"
                    className="ml-4 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Reveal Solution
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ConceptTabs
      standardTabs={{
        concept: conceptContent(),
        practice: practiceContent()
      }}
      customTabs={{}}
      backendTabs={backendTabs}
      isLoadingBackendTabs={isLoadingBackendTabs}
      backendTabsError={backendTabsError}
      defaultTab="concept"
      concept={{
        conceptId: 1,
        conceptName: "Force",
        masteryLevel: 0,
        description: "Understanding force as a push or pull that can change motion, shape, or direction",
        key: animation.component
      }}
    />
  );
};

export default Cbse9PhysicsForceAndLawsOfMotionForceEducational;
