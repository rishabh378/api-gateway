
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
  Move,
  Square,
  Circle,
  Car,
  Truck
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ConceptTabs from '../../ConceptTabs';
import { useBackendTabs } from '../../ConceptWrapper';

export const getKey = () => "cbse_9_physics_force_and_laws_of_motion_inertia";

interface Cbse9PhysicsForceAndLawsOfMotionInertiaEducationalProps {
  animation: {
    id: string;
    title: string;
    description: string;
    config?: any;
    component?: string;
    rightPanelVisible?: boolean;
  };
}

const Cbse9PhysicsForceAndLawsOfMotionInertiaEducational: React.FC<Cbse9PhysicsForceAndLawsOfMotionInertiaEducationalProps> = ({ animation }) => {
  const { backendTabs, isLoadingBackendTabs, backendTabsError } = useBackendTabs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(new Array(10).fill(false));
  const [revealedSolutions, setRevealedSolutions] = useState<boolean[]>(new Array(10).fill(false));
  
  // Animation parameters
  const [mass, setMass] = useState([2]);
  const [initialVelocity, setInitialVelocity] = useState([5]);
  const [frictionCoefficient, setFrictionCoefficient] = useState([0.2]);
  const [animationTime, setAnimationTime] = useState(0);

  const resetAnimation = () => {
    setMass([2]);
    setInitialVelocity([5]);
    setFrictionCoefficient([0.2]);
    setAnimationTime(0);
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

      // Draw ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Draw friction surface texture
      ctx.fillStyle = '#654321';
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.fillRect(i, canvas.height - 45, 5, 5);
      }

      // Calculate position based on physics
      const currentMass = mass[0];
      const currentVelocity = initialVelocity[0];
      const currentFriction = frictionCoefficient[0];
      
      // Friction force = μ * m * g
      const frictionForce = currentFriction * currentMass * 9.8;
      
      // Deceleration = friction force / mass
      const deceleration = frictionForce / currentMass;
      
      // Position calculation with friction
      const t = animationTime / 100; // Convert to seconds
      const velocity = Math.max(0, currentVelocity - deceleration * t);
      const position = currentVelocity * t - 0.5 * deceleration * t * t;
      
      // Draw moving block
      const blockX = 50 + position * 30;
      const blockY = canvas.height - 100;
      const blockSize = 30 + currentMass * 5;
      
      // Block color based on mass
      const blockColor = currentMass > 3 ? '#FF6B6B' : currentMass > 1.5 ? '#4ECDC4' : '#45B7D1';
      ctx.fillStyle = blockColor;
      ctx.fillRect(blockX, blockY, blockSize, blockSize);
      
      // Draw block outline
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, blockY, blockSize, blockSize);
      
      // Draw mass label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentMass}kg`, blockX + blockSize/2, blockY + blockSize/2);
      
      // Draw velocity vector
      if (velocity > 0) {
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(blockX + blockSize/2, blockY - 10);
        ctx.lineTo(blockX + blockSize/2 + velocity * 10, blockY - 10);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(blockX + blockSize/2 + velocity * 10, blockY - 10);
        ctx.lineTo(blockX + blockSize/2 + velocity * 10 - 5, blockY - 15);
        ctx.lineTo(blockX + blockSize/2 + velocity * 10 - 5, blockY - 5);
        ctx.fill();
      }
      
      // Draw friction force vector
      if (velocity > 0) {
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(blockX + blockSize/2, blockY + blockSize + 10);
        ctx.lineTo(blockX + blockSize/2 - frictionForce * 2, blockY + blockSize + 10);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(blockX + blockSize/2 - frictionForce * 2, blockY + blockSize + 10);
        ctx.lineTo(blockX + blockSize/2 - frictionForce * 2 + 5, blockY + blockSize + 5);
        ctx.lineTo(blockX + blockSize/2 - frictionForce * 2 + 5, blockY + blockSize + 15);
        ctx.fill();
      }
      
      // Display values
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 30);
      ctx.fillText(`Friction Force: ${frictionForce.toFixed(2)} N`, 10, 50);
      ctx.fillText(`Position: ${position.toFixed(2)} m`, 10, 70);
      
      // Update animation time
      if (velocity > 0) {
        setAnimationTime(prev => prev + 1);
        animationId = requestAnimationFrame(draw);
      } else {
        // Object stopped due to friction
        ctx.fillStyle = '#FF0000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Object stopped due to friction!', canvas.width/2, 100);
      }
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying, mass, initialVelocity, frictionCoefficient, animationTime]);

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newRevealed = [...prev];
      newRevealed[index] = !newRevealed[index];
      return newRevealed;
    });
  };

  const toggleRevealSolution = (index: number) => {
    setRevealedSolutions(prev => {
      const newRevealed = [...prev];
      newRevealed[index] = !newRevealed[index];
      return newRevealed;
    });
  };

  const conceptContent = () => (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Introduction to Inertia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Imagine you're sitting in a car that suddenly stops. What happens to your body? You continue moving forward! This is because of <strong>inertia</strong> - one of the most fundamental concepts in physics.
          </p>
          <p className="text-blue-700 mb-4">
            Inertia is the natural tendency of objects to resist changes in their state of motion. It's like objects are "lazy" - they don't want to start moving if they're at rest, and they don't want to stop moving if they're already in motion. This property is what makes physics predictable and helps us understand how forces work in our daily lives.
          </p>
          <p className="text-blue-700 mb-4">
            Newton's First Law of Motion, also called the Law of Inertia, states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced force. This means that without external forces like friction, gravity, or applied forces, objects would continue their current state forever.
          </p>
          <p className="text-blue-700">
            The amount of inertia an object has depends on its mass - heavier objects have more inertia and are harder to start moving or stop moving. This is why it's easier to push a bicycle than to push a car, and why stopping a heavy truck requires much more force than stopping a lightweight scooter.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Animation - ISOLATED BOX */}
      <Card className="border-4 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Interactive Inertia Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Animation Description */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4 mb-4">
              <h4 className="font-semibold text-indigo-800 mb-2">What's Happening:</h4>
              <p className="text-indigo-700 text-sm mb-2">
                Watch as a colored block slides across a rough surface, demonstrating how inertia keeps it moving while friction gradually slows it down. The block starts with an initial velocity and gradually comes to rest due to the friction force opposing its motion.
              </p>
              <p className="text-indigo-700 text-sm mb-2">
                <strong>Objects in the Scene:</strong> A colored rectangular block (representing different masses), a brown textured ground surface (representing friction), red velocity vector (showing speed and direction), and orange friction force vector (opposing motion).
              </p>
              <p className="text-indigo-700 text-sm">
                The block's color changes based on its mass: light blue for low mass, teal for medium mass, and red for high mass. The size of the block also increases with mass to show the visual relationship between mass and inertia.
              </p>
            </div>

            {/* Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={animation.rightPanelVisible ? 600 : 800}
                height={300}
                className="border-2 border-indigo-300 rounded-lg bg-gradient-to-b from-sky-200 to-sky-100"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? 'Pause animation' : 'Play animation'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={resetAnimation}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Reset animation to initial state
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Parameter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-800">
                  Mass: {mass[0]} kg
                </label>
                <Slider
                  value={mass}
                  onValueChange={setMass}
                  min={0.5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-800">
                  Initial Velocity: {initialVelocity[0]} m/s
                </label>
                <Slider
                  value={initialVelocity}
                  onValueChange={setInitialVelocity}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-800">
                  Friction Coefficient: {frictionCoefficient[0]}
                </label>
                <Slider
                  value={frictionCoefficient}
                  onValueChange={setFrictionCoefficient}
                  min={0.1}
                  max={0.8}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Control Effects Explanation */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Control Effects:</h4>
              <ul className="text-indigo-700 text-sm space-y-1">
                <li><strong>Play/Pause:</strong> Start or stop the animation to observe motion at any moment</li>
                <li><strong>Reset:</strong> Returns all parameters to default values and restarts the animation</li>
                <li><strong>Mass Slider:</strong> Changes the object's mass - heavier objects have more inertia but same deceleration due to friction</li>
                <li><strong>Initial Velocity:</strong> Sets how fast the object starts moving - higher velocity means longer sliding distance</li>
                <li><strong>Friction Coefficient:</strong> Controls surface roughness - higher values create more friction force and faster stopping</li>
              </ul>
            </div>

            {/* Physical Concepts */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Physical Concepts Shown:</h4>
              <div className="text-indigo-700 text-sm space-y-2">
                <p><strong>Primary Concept:</strong> Inertia - the object's tendency to maintain its motion until friction stops it</p>
                <p><strong>Related Concepts:</strong> Friction force, Newton's First Law, kinetic energy conversion to heat</p>
                <p><strong>Cause and Effect:</strong> Initial velocity gives kinetic energy → Friction opposes motion → Object gradually slows down → Eventually stops when all energy is dissipated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Concepts */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Core Concepts &amp; Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Types of Inertia */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Types of Inertia:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Inertia of Rest</h5>
                  <p className="text-sm text-green-600">The tendency of an object at rest to remain at rest unless acted upon by an external force.</p>
                  <p className="text-xs text-green-500 mt-2"><strong>Example:</strong> A book on a table stays there until you push it.</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Inertia of Motion</h5>
                  <p className="text-sm text-green-600">The tendency of a moving object to continue moving in the same direction at constant speed.</p>
                  <p className="text-xs text-green-500 mt-2"><strong>Example:</strong> A rolling ball continues rolling until friction stops it.</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Inertia of Direction</h5>
                  <p className="text-sm text-green-600">The tendency of a moving object to continue moving in a straight line.</p>
                  <p className="text-xs text-green-500 mt-2"><strong>Example:</strong> Water flies straight out when a spinning bucket stops.</p>
                </div>
              </div>
            </div>

            {/* Key Principles */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Key Principles:</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Mass and Inertia Relationship</h5>
                  <p className="text-sm text-green-600">More massive objects have greater inertia. This means they resist changes in motion more strongly than less massive objects.</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Force Required to Overcome Inertia</h5>
                  <p className="text-sm text-green-600">To change an object's state of motion, you must apply an unbalanced external force. The greater the mass, the greater the force needed.</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Inertia is Not a Force</h5>
                  <p className="text-sm text-green-600">Inertia is a property of matter, not a force. It describes how matter behaves when forces act on it.</p>
                </div>
              </div>
            </div>

            {/* Reference Frames */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Reference Frames:</h4>
              <div className="bg-white rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-600 mb-2">
                  Newton's First Law applies only in <strong>inertial reference frames</strong> - reference frames that are not accelerating.
                </p>
                <p className="text-sm text-green-600">
                  In non-inertial frames (like a car going around a corner), we observe fictitious forces that seem to act on objects due to the frame's acceleration.
                </p>
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
            Mathematical Formulas &amp; Relationships
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
                    ∑F = 0 (when object is at rest or moving at constant velocity)
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>∑F = Sum of all forces acting on the object (in Newtons, N)</li>
                      <li>0 = Net force is zero</li>
                    </ul>
                    <p><strong>Used for:</strong> Determining equilibrium conditions when inertia keeps objects in their current state</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    F = ma (Newton's Second Law, when net force is not zero)
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>F = Net force applied to overcome inertia (in Newtons, N)</li>
                      <li>m = Mass of the object (in kilograms, kg)</li>
                      <li>a = Acceleration produced (in meters per second squared, m/s²)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating the force needed to overcome inertia and accelerate an object</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DERIVED FORMULAS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Derived &amp; Related Formulas:</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    p = mv (Momentum)
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>p = Momentum (in kg⋅m/s)</li>
                      <li>m = Mass (in kg)</li>
                      <li>v = Velocity (in m/s)</li>
                    </ul>
                    <p><strong>Used for:</strong> Measuring the quantity of motion, directly related to inertia</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    f = μN (Friction Force)
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>f = Friction force (in N)</li>
                      <li>μ = Coefficient of friction (dimensionless)</li>
                      <li>N = Normal force (in N)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating the force that opposes motion and eventually overcomes inertia</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    v = u + at (Kinematic equation)
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>v = Final velocity (in m/s)</li>
                      <li>u = Initial velocity (in m/s)</li>
                      <li>a = Acceleration (in m/s²)</li>
                      <li>t = Time (in seconds)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating how velocity changes when forces overcome inertia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIT CONVERSIONS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Important Unit Conversions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <h5 className="font-semibold text-purple-700 mb-2">Mass Units:</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>1 kg = 1000 g</li>
                    <li>1 tonne = 1000 kg</li>
                    <li>1 pound = 0.453 kg</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <h5 className="font-semibold text-purple-700 mb-2">Force Units:</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>1 N = 1 kg⋅m/s²</li>
                    <li>1 kN = 1000 N</li>
                    <li>1 dyne = 10⁻⁵ N</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FORMULA RELATIONSHIPS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">How Formulas Connect:</h4>
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-purple-600 mb-2">
                  <strong>The Chain of Relationships:</strong>
                </p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• <strong>Inertia</strong> is overcome by <strong>Net Force (F = ma)</strong></li>
                  <li>• <strong>Acceleration</strong> changes <strong>Velocity (v = u + at)</strong></li>
                  <li>• <strong>Momentum (p = mv)</strong> represents the total motion affected by inertia</li>
                  <li>• <strong>Friction (f = μN)</strong> provides the force that eventually stops motion</li>
                  <li>• When <strong>∑F = 0</strong>, inertia maintains the current state of motion</li>
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
            {/* Example 1 - Basic */}
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 1: Force to Overcome Inertia (Basic)</h4>
              <p className="text-sm text-orange-700 mb-3">
                <strong>Problem:</strong> A 2 kg book is at rest on a table. What minimum force is needed to start moving it if the coefficient of static friction is 0.3?
              </p>
              <div className="bg-orange-50 rounded p-3">
                <p className="text-sm text-orange-700"><strong>Solution:</strong></p>
                <div className="space-y-2 text-sm text-orange-600">
                  <p>Given: m = 2 kg, μₛ = 0.3, g = 9.8 m/s²</p>
                  <p>To overcome inertia of rest, applied force must exceed static friction</p>
                  <p>Normal force: N = mg = 2 × 9.8 = 19.6 N</p>
                  <p>Maximum static friction: fₛ = μₛN = 0.3 × 19.6 = 5.88 N</p>
                  <p><strong>Minimum force needed = 5.88 N</strong></p>
                </div>
              </div>
            </div>

            {/* Example 2 - Intermediate */}
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 2: Motion with Friction (Intermediate)</h4>
              <p className="text-sm text-orange-700 mb-3">
                <strong>Problem:</strong> A 5 kg box sliding at 8 m/s on a surface with μₖ = 0.2. How long does it take to stop?
              </p>
              <div className="bg-orange-50 rounded p-3">
                <p className="text-sm text-orange-700"><strong>Solution:</strong></p>
                <div className="space-y-2 text-sm text-orange-600">
                  <p>Given: m = 5 kg, u = 8 m/s, μₖ = 0.2, v = 0 (final)</p>
                  <p>Friction force: f = μₖmg = 0.2 × 5 × 9.8 = 9.8 N</p>
                  <p>Deceleration: a = -f/m = -9.8/5 = -1.96 m/s²</p>
                  <p>Using v = u + at: 0 = 8 + (-1.96)t</p>
                  <p><strong>Time to stop = 8/1.96 = 4.08 seconds</strong></p>
                </div>
              </div>
            </div>

            {/* Example 3 - Advanced */}
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 3: Car Accident Analysis (Advanced)</h4>
              <p className="text-sm text-orange-700 mb-3">
                <strong>Problem:</strong> A 1200 kg car traveling at 20 m/s crashes into a barrier. If the car stops in 0.8 seconds, what force did the barrier apply?
              </p>
              <div className="bg-orange-50 rounded p-3">
                <p className="text-sm text-orange-700"><strong>Solution:</strong></p>
                <div className="space-y-2 text-sm text-orange-600">
                  <p>Given: m = 1200 kg, u = 20 m/s, v = 0, t = 0.8 s</p>
                  <p>First find acceleration: a = (v - u)/t = (0 - 20)/0.8 = -25 m/s²</p>
                  <p>Using Newton's Second Law: F = ma = 1200 × (-25) = -30,000 N</p>
                  <p>The negative sign indicates the force opposes motion</p>
                  <p><strong>Barrier force = 30,000 N (30 kN)</strong></p>
                </div>
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
                  <h5 className="font-semibold text-red-700 mb-2">Sliding on Ice</h5>
                  <p className="text-sm text-red-600 mb-2">When you slip on ice, you keep sliding in the same direction even after your foot stops pushing. The low friction on ice can't provide enough force to quickly overcome your body's inertia of motion.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Your body demonstrates inertia of motion - continuing to move until friction or another force stops you.</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Opening Stuck Jar Lids</h5>
                  <p className="text-sm text-red-600 mb-2">A tight jar lid resists your twisting force due to inertia of rest. You need to apply enough torque to overcome the static friction and the lid's resistance to rotation.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> The lid exhibits inertia of rest - it wants to stay stationary until you apply sufficient rotational force.</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Sudden Elevator Stops</h5>
                  <p className="text-sm text-red-600 mb-2">When an elevator suddenly stops, you feel like you're still moving upward for a moment. Your body's inertia wants to continue moving at the same speed the elevator was traveling.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Your body demonstrates inertia of motion - resisting the change when the elevator decelerates.</p>
                </div>
              </div>
            </div>

            {/* TRANSPORTATION */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Transportation:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Seat Belts in Cars</h5>
                  <p className="text-sm text-red-600 mb-2">During a car crash, the vehicle stops suddenly but your body continues moving forward due to inertia. Seat belts provide the necessary force to change your motion and match the car's deceleration.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Seat belts overcome your body's inertia of motion by applying a restraining force during sudden stops.</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Heavy Trucks Need More Distance</h5>
                  <p className="text-sm text-red-600 mb-2">Large trucks require much longer stopping distances than cars because their greater mass means greater inertia. The same braking force produces less deceleration on a heavier vehicle.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Greater mass equals greater inertia, requiring more force or more time to change the motion state.</p>
                </div>
              </div>
            </div>

            {/* SPORTS & RECREATION */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Sports &amp; Recreation:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Bowling Ball vs Ping Pong Ball</h5>
                  <p className="text-sm text-red-600 mb-2">A bowling ball is much harder to start rolling and harder to stop than a ping pong ball, even though both are spheres. This is because the bowling ball has much greater inertia due to its larger mass.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Mass directly determines inertia - more massive objects resist changes in motion more strongly.</p>
                </div>
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
                question: "What is inertia and how does it relate to mass?",
                answer: "Inertia is the resistance of any physical object to any change in its velocity. It is directly proportional to mass - objects with more mass have greater inertia and are harder to accelerate or decelerate."
              },
              {
                question: "State Newton's First Law of Motion in your own words.",
                answer: "An object at rest stays at rest and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced external force. This is also called the Law of Inertia."
              },
              {
                question: "What are the three types of inertia?",
                answer: "1) Inertia of rest - tendency to remain stationary, 2) Inertia of motion - tendency to continue moving at constant velocity, 3) Inertia of direction - tendency to continue moving in a straight line."
              },
              {
                question: "Why do passengers jerk forward when a bus suddenly stops?",
                answer: "Due to inertia of motion, passengers continue moving forward at the bus's original speed when the bus stops suddenly. Their bodies resist the change in motion until the seat or other forces act on them."
              },
              {
                question: "How is inertia related to reference frames?",
                answer: "Newton's First Law and the concept of inertia are only valid in inertial reference frames (non-accelerating frames). In accelerating frames, fictitious forces appear to act on objects."
              },
              {
                question: "What force is needed to overcome inertia of rest?",
                answer: "To overcome inertia of rest, the applied force must be greater than the maximum static friction force. This minimum force is given by F > μₛmg, where μₛ is the coefficient of static friction."
              },
              {
                question: "How does friction relate to inertia?",
                answer: "Friction provides the external force needed to change an object's state of motion, thereby overcoming inertia. Without friction, objects would continue moving indefinitely due to inertia."
              },
              {
                question: "Why is it harder to push a car than a bicycle?",
                answer: "A car has much greater mass than a bicycle, which means it has greater inertia. More force is required to overcome the car's inertia and change its state of motion."
              },
              {
                question: "What happens to inertia in space where there's no friction?",
                answer: "In space, objects still have inertia based on their mass. However, without friction or other resistive forces, objects will continue moving at constant velocity indefinitely once set in motion."
              },
              {
                question: "How do seat belts work in terms of inertia?",
                answer: "During sudden stops, your body's inertia keeps it moving forward while the car decelerates. Seat belts provide the necessary force to change your body's motion and match the car's deceleration, preventing injury."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-blue-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 mb-2">{item.question}</p>
                    {revealedAnswers[index] && (
                      <p className="text-sm text-blue-600 mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        {item.answer}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => toggleRevealAnswer(index)}
                    variant="outline"
                    size="sm"
                    className="ml-4 text-blue-600 border-blue-300 hover:bg-blue-50"
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
                problem: "A 3 kg box is at rest on a horizontal surface. If the coefficient of static friction is 0.25, what minimum force is required to start moving the box?",
                solution: "Given: m = 3 kg, μₛ = 0.25, g = 9.8 m/s²\nTo overcome inertia of rest, applied force must exceed static friction.\nNormal force: N = mg = 3 × 9.8 = 29.4 N\nMaximum static friction: fₛ = μₛN = 0.25 × 29.4 = 7.35 N\nMinimum force required = 7.35 N"
              },
              {
                problem: "A 1500 kg car traveling at 25 m/s brakes and comes to rest in 8 seconds. Calculate the braking force applied.",
                solution: "Given: m = 1500 kg, u = 25 m/s, v = 0 m/s, t = 8 s\nFirst find acceleration: a = (v - u)/t = (0 - 25)/8 = -3.125 m/s²\nUsing Newton's Second Law: F = ma = 1500 × (-3.125) = -4687.5 N\nBraking force = 4687.5 N (magnitude)"
              },
              {
                problem: "A 2 kg book slides across a table with an initial velocity of 6 m/s. If the coefficient of kinetic friction is 0.3, how far will it slide before stopping?",
                solution: "Given: m = 2 kg, u = 6 m/s, v = 0, μₖ = 0.3\nFriction force: f = μₖmg = 0.3 × 2 × 9.8 = 5.88 N\nDeceleration: a = -f/m = -5.88/2 = -2.94 m/s²\nUsing v² = u² + 2as: 0 = 36 + 2(-2.94)s\nDistance s = 36/(2 × 2.94) = 6.12 m"
              },
              {
                problem: "A 0.5 kg ball is thrown horizontally with a velocity of 12 m/s. What force would be needed to stop it in 0.2 seconds?",
                solution: "Given: m = 0.5 kg, u = 12 m/s, v = 0, t = 0.2 s\nAcceleration: a = (v - u)/t = (0 - 12)/0.2 = -60 m/s²\nForce needed: F = ma = 0.5 × (-60) = -30 N\nMagnitude of stopping force = 30 N"
              },
              {
                problem: "Two boxes of masses 2 kg and 6 kg are pushed with the same force of 24 N. Compare their accelerations.",
                solution: "Given: m₁ = 2 kg, m₂ = 6 kg, F = 24 N\nFor 2 kg box: a₁ = F/m₁ = 24/2 = 12 m/s²\nFor 6 kg box: a₂ = F/m₂ = 24/6 = 4 m/s²\nThe lighter box accelerates 3 times faster than the heavier box due to less inertia."
              },
              {
                problem: "A 10 kg sled is pulled across snow with a force of 50 N. If the coefficient of friction is 0.1, find the acceleration.",
                solution: "Given: m = 10 kg, Applied force = 50 N, μ = 0.1\nFriction force: f = μmg = 0.1 × 10 × 9.8 = 9.8 N\nNet force: F_net = 50 - 9.8 = 40.2 N\nAcceleration: a = F_net/m = 40.2/10 = 4.02 m/s²"
              },
              {
                problem: "A 800 kg elevator accelerates upward at 2 m/s². What is the tension in the cable?",
                solution: "Given: m = 800 kg, a = 2 m/s² (upward), g = 9.8 m/s²\nWeight = mg = 800 × 9.8 = 7840 N (downward)\nFor upward acceleration: T - mg = ma\nTension T = mg + ma = 7840 + (800 × 2) = 7840 + 1600 = 9440 N"
              },
              {
                problem: "A 4 kg block on a frictionless surface is pushed with a force of 16 N. After 5 seconds, what will be its velocity?",
                solution: "Given: m = 4 kg, F = 16 N, t = 5 s, u = 0 (starts from rest)\nAcceleration: a = F/m = 16/4 = 4 m/s²\nUsing v = u + at: v = 0 + 4 × 5 = 20 m/s\nFinal velocity = 20 m/s"
              },
              {
                problem: "A 1200 kg car needs to accelerate from 0 to 30 m/s in 10 seconds. What force must the engine provide if friction is 200 N?",
                solution: "Given: m = 1200 kg, u = 0, v = 30 m/s, t = 10 s, friction = 200 N\nRequired acceleration: a = (v - u)/t = 30/10 = 3 m/s²\nForce needed for acceleration: F₁ = ma = 1200 × 3 = 3600 N\nTotal engine force = F₁ + friction = 3600 + 200 = 3800 N"
              },
              {
                problem: "A 5 kg box slides down a 30° incline with coefficient of friction 0.2. Find its acceleration.",
                solution: "Given: m = 5 kg, θ = 30°, μ = 0.2\nComponent of weight along incline: mg sin θ = 5 × 9.8 × sin 30° = 24.5 N\nNormal force: N = mg cos θ = 5 × 9.8 × cos 30° = 42.4 N\nFriction force: f = μN = 0.2 × 42.4 = 8.48 N\nNet force down incline: F_net = 24.5 - 8.48 = 16.02 N\nAcceleration: a = F_net/m = 16.02/5 = 3.2 m/s²"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-green-800 mb-2">Problem {index + 1}:</p>
                    <p className="text-sm text-green-700 mb-2">{item.problem}</p>
                    {revealedSolutions[index] && (
                      <div className="text-sm text-green-600 mt-2 p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <p className="font-medium mb-2">Solution:</p>
                        <pre className="whitespace-pre-wrap text-xs">{item.solution}</pre>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => toggleRevealSolution(index)}
                    variant="outline"
                    size="sm"
                    className="ml-4 text-green-600 border-green-300 hover:bg-green-50"
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
        conceptName: "Inertia",
        masteryLevel: 0,
        description: "Understanding the tendency of objects to resist changes in their state of motion",
        key: animation.component
      }}
    />
  );
};

export default Cbse9PhysicsForceAndLawsOfMotionInertiaEducational;
