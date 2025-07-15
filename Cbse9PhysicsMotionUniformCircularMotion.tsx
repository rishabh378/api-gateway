
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
  Clock,
  RotateCw,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ConceptTabs from '../../ConceptTabs';
import { useBackendTabs } from '../../ConceptWrapper';

export const getKey = () => "cbse_9_physics_motion_uniform_circular_motion";

interface Cbse9PhysicsMotionUniformCircularMotionProps {
  animation: {
    id: string;
    title: string;
    description: string;
    config?: any;
    component?: string;
    rightPanelVisible?: boolean;
  };
}

const Cbse9PhysicsMotionUniformCircularMotion: React.FC<Cbse9PhysicsMotionUniformCircularMotionProps> = ({ animation }) => {
  const { backendTabs, isLoadingBackendTabs, backendTabsError } = useBackendTabs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [radius, setRadius] = useState([80]);
  const [speed, setSpeed] = useState([2]);
  const [showVectors, setShowVectors] = useState(true);
  const [angle, setAngle] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(new Array(10).fill(false));
  const [revealedSolutions, setRevealedSolutions] = useState<boolean[]>(new Array(10).fill(false));

  const resetAnimation = () => {
    setRadius([80]);
    setSpeed([2]);
    setAngle(0);
    setShowVectors(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      if (!isPlaying) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const r = radius[0];
      
      // Draw circular path
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate object position
      const objX = centerX + r * Math.cos(angle);
      const objY = centerY + r * Math.sin(angle);

      // Draw object (ball)
      ctx.beginPath();
      ctx.arc(objX, objY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();

      // Draw radius line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(objX, objY);
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (showVectors) {
        // Draw velocity vector (tangent to circle)
        const tangentX = -Math.sin(angle);
        const tangentY = Math.cos(angle);
        const vectorLength = 30;
        
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(objX + tangentX * vectorLength, objY + tangentY * vectorLength);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw velocity vector arrowhead
        const arrowSize = 6;
        ctx.beginPath();
        ctx.moveTo(objX + tangentX * vectorLength, objY + tangentY * vectorLength);
        ctx.lineTo(objX + tangentX * (vectorLength - arrowSize) - tangentY * arrowSize, 
                   objY + tangentY * (vectorLength - arrowSize) + tangentX * arrowSize);
        ctx.moveTo(objX + tangentX * vectorLength, objY + tangentY * vectorLength);
        ctx.lineTo(objX + tangentX * (vectorLength - arrowSize) + tangentY * arrowSize, 
                   objY + tangentY * (vectorLength - arrowSize) - tangentX * arrowSize);
        ctx.stroke();

        // Draw centripetal force vector (toward center)
        const centripX = centerX - objX;
        const centripY = centerY - objY;
        const centripLength = 25;
        const centripNormX = centripX / r;
        const centripNormY = centripY / r;

        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(objX + centripNormX * centripLength, objY + centripNormY * centripLength);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw centripetal force arrowhead
        ctx.beginPath();
        ctx.moveTo(objX + centripNormX * centripLength, objY + centripNormY * centripLength);
        ctx.lineTo(objX + centripNormX * (centripLength - arrowSize) - centripNormY * arrowSize,
                   objY + centripNormY * (centripLength - arrowSize) + centripNormX * arrowSize);
        ctx.moveTo(objX + centripNormX * centripLength, objY + centripNormY * centripLength);
        ctx.lineTo(objX + centripNormX * (centripLength - arrowSize) + centripNormY * arrowSize,
                   objY + centripNormY * (centripLength - arrowSize) - centripNormX * arrowSize);
        ctx.stroke();
      }

      // Labels
      ctx.fillStyle = "#374151";
      ctx.font = "12px sans-serif";
      ctx.fillText("Center", centerX + 5, centerY - 5);
      ctx.fillText(`r = ${r}m`, centerX - 20, centerY + r/2);
      
      if (showVectors) {
        ctx.fillStyle = "#10b981";
        ctx.fillText("Velocity", objX + 35, objY - 15);
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("Centripetal Force", objX + 35, objY + 35);
      }

      // Update angle for next frame
      setAngle(prev => prev + speed[0] * 0.02);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying, radius, speed, showVectors, angle]);

  const conceptContent = () => (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Introduction to Uniform Circular Motion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Uniform circular motion is a special type of motion where an object moves in a circular path at constant speed. Although the speed remains constant, the direction of motion continuously changes, which means the object is actually accelerating! This might seem confusing at first, but remember that acceleration involves any change in velocity, and since velocity is a vector quantity (having both magnitude and direction), changing direction means changing velocity.
          </p>
          <p className="text-blue-700 mb-4">
            Think of a stone tied to a string being whirled in a horizontal circle, or a car taking a circular turn at constant speed. In both cases, the object maintains the same speed but continuously changes direction. This change in direction requires a force directed toward the center of the circle, called centripetal force.
          </p>
          <p className="text-blue-700">
            Understanding uniform circular motion is crucial because it explains many phenomena we observe daily - from the motion of planets around the sun to the working of washing machines and the banking of roads at turns. It's a fundamental concept that bridges linear motion with rotational motion in physics.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Animation - ISOLATED BOX */}
      <Card className="border-4 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <RotateCw className="w-5 h-5" />
            Interactive Uniform Circular Motion Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Detailed Description */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-3">What's Happening in the Animation:</h4>
              <div className="space-y-3 text-indigo-700">
                <p><strong>Scene Description:</strong> A blue ball (representing any object in circular motion) moves along a circular path around a red center point. The dashed gray circle shows the complete circular path, and a gray line connects the center to the ball, representing the radius.</p>
                <p><strong>Motion Process:</strong> The ball maintains constant speed while continuously changing direction. At every instant, the ball wants to move in a straight line (due to inertia) but is constantly pulled toward the center by centripetal force.</p>
                <p><strong>Key Objects:</strong> Blue ball (moving object), red center point (pivot), dashed circle (path), gray radius line, green velocity vector (tangent to circle), yellow centripetal force vector (pointing toward center).</p>
              </div>
            </div>

            {/* Animation Canvas */}
            <div className="bg-white rounded-lg border border-indigo-200 p-4">
              <canvas
                ref={canvasRef}
                width={animation.rightPanelVisible ? 400 : 600}
                height={400}
                className="border border-gray-300 rounded"
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={resetAnimation} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowVectors(!showVectors)}
                    variant={showVectors ? "default" : "outline"}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showVectors ? 'Hide Vectors' : 'Show Vectors'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Radius: {radius[0]}m</label>
                  <Slider
                    value={radius}
                    onValueChange={setRadius}
                    max={120}
                    min={40}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Speed: {speed[0]}m/s</label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Control Effects */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-3">Control Effects:</h4>
              <div className="space-y-2 text-indigo-700 text-sm">
                <p><strong>Play/Pause:</strong> Starts or stops the circular motion. When paused, you can clearly observe the position of vectors and the ball's instantaneous position.</p>
                <p><strong>Reset:</strong> Returns the ball to its starting position, resets radius to 80m and speed to 2m/s, and ensures vectors are visible.</p>
                <p><strong>Radius Slider:</strong> Changes the size of the circular path from 40m to 120m. Larger radius means a bigger circle but same principles apply.</p>
                <p><strong>Speed Slider:</strong> Adjusts how fast the ball moves along the circle (1-5 m/s). Higher speed means faster motion but the ball still follows the same circular path.</p>
                <p><strong>Show/Hide Vectors:</strong> Toggles the visibility of velocity (green) and centripetal force (yellow) vectors to help visualize the physics.</p>
              </div>
            </div>

            {/* Physical Concepts */}
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-4">
              <h4 className="font-semibold text-indigo-800 mb-3">Physical Concepts Shown:</h4>
              <div className="space-y-2 text-indigo-700 text-sm">
                <p><strong>Primary Concept:</strong> Uniform circular motion - constant speed in a circular path with continuously changing direction.</p>
                <p><strong>Related Concepts:</strong> Centripetal force (always pointing toward center), velocity as a vector (green arrow tangent to circle), acceleration toward center, and inertia (tendency to move straight).</p>
                <p><strong>Cause and Effect:</strong> The centripetal force causes the direction change, preventing the object from flying off in a straight line. Without this force, the ball would move tangentially due to inertia.</p>
                <p><strong>Real-time Observation:</strong> Notice how the velocity vector is always perpendicular to the radius and tangent to the circle, while the centripetal force vector always points toward the center.</p>
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
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Key Characteristics:</h4>
              <ul className="space-y-2 text-green-700">
                <li><strong>Constant Speed:</strong> The magnitude of velocity remains unchanged throughout the motion.</li>
                <li><strong>Changing Direction:</strong> The direction of velocity continuously changes as the object moves along the circular path.</li>
                <li><strong>Centripetal Acceleration:</strong> Acceleration is always directed toward the center of the circle.</li>
                <li><strong>Centripetal Force:</strong> A net force toward the center is required to maintain circular motion.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-3">Types of Circular Motion:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Uniform Circular Motion</h5>
                  <p className="text-sm text-green-600">Constant speed, constant radius, uniform centripetal acceleration</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Non-uniform Circular Motion</h5>
                  <p className="text-sm text-green-600">Changing speed, constant radius, varying acceleration</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-3">Important Principles:</h4>
              <ul className="space-y-2 text-green-700">
                <li><strong>Inertia:</strong> Objects naturally want to move in straight lines, so force is needed to make them move in circles.</li>
                <li><strong>Vector Nature:</strong> Velocity and acceleration are vectors; changing direction means changing velocity.</li>
                <li><strong>Perpendicular Vectors:</strong> In uniform circular motion, velocity is always perpendicular to acceleration.</li>
                <li><strong>Centripetal vs Centrifugal:</strong> Centripetal force is real and points inward; centrifugal force is a perceived outward force in rotating reference frames.</li>
              </ul>
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
                    v = 2πr/T
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>v = linear velocity (meter/second)</li>
                      <li>r = radius of circular path (meter)</li>
                      <li>T = time period (seconds)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating the speed of an object in circular motion when you know the radius and time period.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    ac = v²/r
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>ac = centripetal acceleration (meter/second²)</li>
                      <li>v = linear velocity (meter/second)</li>
                      <li>r = radius of circular path (meter)</li>
                    </ul>
                    <p><strong>Used for:</strong> Finding the acceleration directed toward the center of the circular path.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    Fc = mac = mv²/r
                  </div>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Fc = centripetal force (newton)</li>
                      <li>m = mass of object (kilogram)</li>
                      <li>v = linear velocity (meter/second)</li>
                      <li>r = radius of circular path (meter)</li>
                    </ul>
                    <p><strong>Used for:</strong> Calculating the force required to keep an object moving in a circular path.</p>
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
                    f = 1/T = v/2πr
                  </div>
                  <div className="text-sm text-purple-700">
                    <p><strong>Where:</strong> f = frequency (hertz), T = time period (seconds)</p>
                    <p><strong>Used for:</strong> Finding how many complete circles are completed per second.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    ω = 2π/T = v/r
                  </div>
                  <div className="text-sm text-purple-700">
                    <p><strong>Where:</strong> ω = angular velocity (radian/second)</p>
                    <p><strong>Used for:</strong> Measuring how fast the object rotates in terms of angle per unit time.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-center text-lg font-mono mb-3">
                    ac = ω²r = 4π²r/T²
                  </div>
                  <div className="text-sm text-purple-700">
                    <p><strong>Used for:</strong> Alternative ways to calculate centripetal acceleration using angular velocity or time period.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIT CONVERSIONS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Important Unit Conversions:</h4>
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <ul className="space-y-2 text-purple-700">
                  <li><strong>Angular measurements:</strong> 1 complete circle = 2π radians = 360°</li>
                  <li><strong>Frequency:</strong> 1 hertz = 1 cycle per second</li>
                  <li><strong>Angular velocity:</strong> 1 radian/second = 57.3 degrees/second</li>
                  <li><strong>Common speeds:</strong> 1 m/s = 3.6 km/h</li>
                </ul>
              </div>
            </div>

            {/* FORMULA RELATIONSHIPS */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">How Formulas Connect:</h4>
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <div className="space-y-3 text-purple-700">
                  <p><strong>Speed → Acceleration → Force:</strong> Once you know the speed (v = 2πr/T), you can find acceleration (ac = v²/r), and then force (Fc = mac).</p>
                  <p><strong>Time relationships:</strong> Period T and frequency f are reciprocals (f = 1/T). Both relate to angular velocity ω = 2π/T = 2πf.</p>
                  <p><strong>Linear vs Angular:</strong> Linear velocity v = ωr connects linear motion concepts with rotational motion concepts.</p>
                  <p><strong>Force requirement:</strong> All formulas ultimately help determine the centripetal force needed to maintain circular motion.</p>
                </div>
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
              <h4 className="font-semibold text-orange-800 mb-3">Example 1: Basic Circular Motion</h4>
              <div className="space-y-2 text-orange-700">
                <p><strong>Problem:</strong> A stone tied to a 1.5m string is whirled in a horizontal circle. It completes 10 revolutions in 8 seconds. Find the linear velocity and centripetal acceleration.</p>
                <p><strong>Given:</strong> r = 1.5m, Number of revolutions = 10, Time = 8s</p>
                <p><strong>Solution:</strong></p>
                <div className="ml-4 space-y-1">
                  <p>Time period T = Total time / Number of revolutions = 8s / 10 = 0.8s</p>
                  <p>Linear velocity v = 2πr/T = 2π × 1.5 / 0.8 = 11.78 m/s</p>
                  <p>Centripetal acceleration ac = v²/r = (11.78)² / 1.5 = 92.5 m/s²</p>
                </div>
                <p><strong>Answer:</strong> Linear velocity = 11.78 m/s, Centripetal acceleration = 92.5 m/s²</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 2: Centripetal Force</h4>
              <div className="space-y-2 text-orange-700">
                <p><strong>Problem:</strong> A 0.5kg ball moves in a circular path of radius 2m with a speed of 4 m/s. Calculate the centripetal force required.</p>
                <p><strong>Given:</strong> m = 0.5kg, r = 2m, v = 4 m/s</p>
                <p><strong>Solution:</strong></p>
                <div className="ml-4 space-y-1">
                  <p>Centripetal force Fc = mv²/r</p>
                  <p>Fc = 0.5 × (4)² / 2 = 0.5 × 16 / 2 = 4 N</p>
                </div>
                <p><strong>Answer:</strong> Centripetal force = 4 N directed toward the center</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Example 3: Finding Radius</h4>
              <div className="space-y-2 text-orange-700">
                <p><strong>Problem:</strong> A car travels at 20 m/s around a circular track. If the centripetal acceleration is 8 m/s², find the radius of the track.</p>
                <p><strong>Given:</strong> v = 20 m/s, ac = 8 m/s²</p>
                <p><strong>Solution:</strong></p>
                <div className="ml-4 space-y-1">
                  <p>From ac = v²/r, we get r = v²/ac</p>
                  <p>r = (20)² / 8 = 400 / 8 = 50 m</p>
                </div>
                <p><strong>Answer:</strong> Radius of the track = 50 m</p>
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
                  <h5 className="font-semibold text-red-700 mb-2">Washing Machine Spin Cycle</h5>
                  <p className="text-sm text-red-600 mb-2">When your washing machine spins, clothes experience centripetal force that keeps them moving in a circle. Water droplets, having less grip, fly off tangentially through the holes, leaving clothes drier.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> The drum provides centripetal force to clothes while water escapes due to insufficient centripetal force.</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Stirring Tea or Coffee</h5>
                  <p className="text-sm text-red-600 mb-2">When you stir your tea, the liquid moves in circular motion. Tea leaves or sugar crystals experience centripetal acceleration and tend to collect at the center due to the pressure differences created.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> The spoon provides the force for circular motion, and particles settle based on centripetal force balance.</p>
                </div>
              </div>
            </div>

            {/* SPORTS & RECREATION */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Sports &amp; Recreation:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Hammer Throw in Athletics</h5>
                  <p className="text-sm text-red-600 mb-2">Athletes spin the hammer in circles before release. The athlete provides centripetal force through the wire. When released, the hammer flies off tangentially, demonstrating that objects naturally want to move in straight lines.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Perfect example of centripetal force and tangential release in uniform circular motion.</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-4">
                  <h5 className="font-semibold text-red-700 mb-2">Cycling Around Curves</h5>
                  <p className="text-sm text-red-600 mb-2">When cycling around a curve, you lean inward to provide the centripetal force needed for circular motion. The friction between tires and road acts as the centripetal force, while your body balances the forces.</p>
                  <p className="text-xs text-red-500"><strong>Connection:</strong> Friction provides centripetal force, and banking (leaning) helps maintain circular motion safely.</p>
                </div>
              </div>
            </div>

            {/* TRANSPORTATION */}
            <div>
              <h4 className="font-semibold text-red-800 mb-3">In Transportation:</h4>
              <div className="bg-white rounded-lg border border-red-200 p-4">
                <h5 className="font-semibold text-red-700 mb-2">Banked Roads and Highways</h5>
                <p className="text-sm text-red-600 mb-2">Roads at turns are banked (tilted inward) to help vehicles navigate curves safely. The banking angle provides part of the centripetal force, reducing dependence on friction alone. This prevents vehicles from skidding outward during turns.</p>
                <p className="text-xs text-red-500"><strong>Connection:</strong> Banking uses gravitational component to provide centripetal force, demonstrating practical application of circular motion physics.</p>
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
                question: "What is uniform circular motion?",
                answer: "Motion of an object in a circular path at constant speed, where the direction continuously changes but the magnitude of velocity remains constant."
              },
              {
                question: "Why is circular motion considered accelerated motion even at constant speed?",
                answer: "Because acceleration involves any change in velocity, and since direction is changing continuously, the velocity vector changes, resulting in centripetal acceleration."
              },
              {
                question: "What is centripetal force and its direction?",
                answer: "Centripetal force is the net force that acts on an object moving in a circular path, always directed toward the center of the circle."
              },
              {
                question: "How is centripetal acceleration calculated?",
                answer: "Centripetal acceleration is calculated using ac = v²/r, where v is linear velocity and r is radius of the circular path."
              },
              {
                question: "What is the relationship between linear velocity and angular velocity?",
                answer: "Linear velocity v = ωr, where ω is angular velocity and r is radius. This connects linear motion with rotational motion."
              },
              {
                question: "What happens to centripetal force if speed doubles?",
                answer: "Since Fc = mv²/r, if speed doubles, centripetal force becomes four times larger (force increases with square of velocity)."
              },
              {
                question: "How does radius affect centripetal acceleration?",
                answer: "Centripetal acceleration is inversely proportional to radius. Larger radius means smaller acceleration for the same speed."
              },
              {
                question: "What is the difference between centripetal and centrifugal force?",
                answer: "Centripetal force is a real force toward the center. Centrifugal force is a fictitious force felt in rotating reference frames, appearing to push outward."
              },
              {
                question: "Why do objects fly off tangentially when circular motion stops?",
                answer: "Due to inertia (Newton's first law), objects naturally want to move in straight lines. When centripetal force is removed, objects continue in the direction they were moving."
              },
              {
                question: "What provides centripetal force for planets orbiting the sun?",
                answer: "Gravitational force between the planet and sun provides the centripetal force required for the planet's circular (or elliptical) motion."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 mb-2">{item.question}</p>
                    {revealedAnswers[index] && (
                      <p className="text-blue-600 text-sm">{item.answer}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      const newRevealed = [...revealedAnswers];
                      newRevealed[index] = !newRevealed[index];
                      setRevealedAnswers(newRevealed);
                    }}
                    variant="outline"
                    size="sm"
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
                problem: "A ball tied to a string of length 0.8m is whirled in a horizontal circle at 3 m/s. Calculate the centripetal acceleration.",
                solution: "Given: r = 0.8m, v = 3 m/s\nUsing ac = v²/r\nac = (3)²/0.8 = 9/0.8 = 11.25 m/s²"
              },
              {
                problem: "A 2kg object moves in a circular path of radius 5m with centripetal acceleration of 8 m/s². Find the centripetal force.",
                solution: "Given: m = 2kg, r = 5m, ac = 8 m/s²\nUsing Fc = mac\nFc = 2 × 8 = 16 N"
              },
              {
                problem: "A car travels around a circular track of radius 100m at 20 m/s. What is the time period for one complete revolution?",
                solution: "Given: r = 100m, v = 20 m/s\nUsing v = 2πr/T, so T = 2πr/v\nT = 2π × 100/20 = 200π/20 = 10π ≈ 31.4 seconds"
              },
              {
                problem: "If the centripetal force on an object is 50N, mass is 5kg, and radius is 2m, find the linear velocity.",
                solution: "Given: Fc = 50N, m = 5kg, r = 2m\nUsing Fc = mv²/r, so v² = Fcr/m\nv² = 50 × 2/5 = 20\nv = √20 = 4.47 m/s"
              },
              {
                problem: "A wheel of radius 0.5m rotates at 4 revolutions per second. Calculate the linear velocity at the rim.",
                solution: "Given: r = 0.5m, frequency f = 4 Hz\nTime period T = 1/f = 1/4 = 0.25 s\nUsing v = 2πr/T\nv = 2π × 0.5/0.25 = π/0.25 = 4π ≈ 12.57 m/s"
              },
              {
                problem: "An object in circular motion has angular velocity 2π rad/s and radius 3m. Find the centripetal acceleration.",
                solution: "Given: ω = 2π rad/s, r = 3m\nUsing ac = ω²r\nac = (2π)² × 3 = 4π² × 3 = 12π² ≈ 118.4 m/s²"
              },
              {
                problem: "A stone of mass 0.1kg is whirled in a vertical circle of radius 1m. If the speed at the bottom is 6 m/s, find the tension in the string.",
                solution: "Given: m = 0.1kg, r = 1m, v = 6 m/s\nAt bottom: T = mg + mv²/r\nT = 0.1 × 10 + 0.1 × 36/1 = 1 + 3.6 = 4.6 N"
              },
              {
                problem: "A satellite orbits Earth at height 400km above surface. If Earth's radius is 6400km, find the orbital speed. (g = 9.8 m/s²)",
                solution: "Given: h = 400km, R = 6400km, orbital radius r = 6800km = 6.8 × 10⁶ m\nFor circular orbit: v = √(gr) where g at surface = 9.8 m/s²\nv = √(9.8 × 6.8 × 10⁶) = √(6.664 × 10⁷) ≈ 7760 m/s"
              },
              {
                problem: "A cyclist leans at 15° while taking a turn of radius 20m. If coefficient of friction is 0.3, find the maximum safe speed.",
                solution: "For banked turn: v = √(rg(μ + tan θ)/(1 - μ tan θ))\nGiven: r = 20m, θ = 15°, μ = 0.3, g = 9.8 m/s²\ntan 15° = 0.268\nv = √(20 × 9.8 × (0.3 + 0.268)/(1 - 0.3 × 0.268))\nv = √(196 × 0.568/0.92) ≈ 12.1 m/s"
              },
              {
                problem: "A conical pendulum has a string length of 1.5m and makes 30° with vertical. Calculate the time period.",
                solution: "Given: L = 1.5m, θ = 30°\nRadius r = L sin θ = 1.5 × sin 30° = 1.5 × 0.5 = 0.75m\nHeight h = L cos θ = 1.5 × cos 30° = 1.5 × 0.866 = 1.3m\nUsing T = 2π√(h/g) = 2π√(1.3/9.8) = 2π√(0.133) ≈ 2.29 seconds"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-green-800 mb-2">Problem {index + 1}:</p>
                    <p className="text-green-700 text-sm mb-3">{item.problem}</p>
                    {revealedSolutions[index] && (
                      <div className="bg-green-100 rounded p-3 mt-2">
                        <p className="text-green-800 text-sm font-medium mb-2">Solution:</p>
                        <pre className="text-green-700 text-sm whitespace-pre-wrap">{item.solution}</pre>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      const newRevealed = [...revealedSolutions];
                      newRevealed[index] = !newRevealed[index];
                      setRevealedSolutions(newRevealed);
                    }}
                    variant="outline"
                    size="sm"
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
        conceptName: "Uniform Circular Motion",
        masteryLevel: 0,
        description: "Motion of an object in a circular path at constant speed",
        key: animation.component
      }}
    />
  );
};

export default Cbse9PhysicsMotionUniformCircularMotion;
