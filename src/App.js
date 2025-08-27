import React, { useState, useEffect } from "react";
import "./App.css";

const HeartIcon = () => (
  <span className="inline-block w-5 h-5 text-center">❤️</span>
);
const StarIcon = () => (
  <span className="inline-block w-5 h-5 text-center"></span>
);

const CodeIcon = () => (
  <span className="inline-block w-5 h-5 text-center"></span>
);

const TrophyIcon = () => (
  <span className="inline-block w-5 h-5 text-center"></span>
);

const ZapIcon = () => (
  <span className="inline-block w-5 h-5 text-center">⚡</span>
);

const PokePet = () => {
  const [pet, setPet] = useState({
    name: "Charmander",
    level: 1,
    experience: 0,
    health: 100,
    happiness: 80,
    energy: 90,
    stage: "charmander", // charmander -> charmeleon -> charizard
    type: "Fire",
  });

  const [todayStats, setTodayStats] = useState({
    commits: 0,
    linesOfCode: 0,
    hoursSpent: 0,
    newLanguages: 0,
    projectsCompleted: 0,
    leetcodeSolved: 0,
    coffeeCount: 0,
  });

  const [allTimeStats, setAllTimeStats] = useState({
    totalLanguages: 0,
    totalProjects: 0,
  });

  const [showFeedback, setShowFeedback] = useState("");

  // Experience thresholds for each level (levels 1-40)
  const experienceThresholds = [
    0,
    50,
    120,
    200,
    300,
    420,
    560,
    720,
    900,
    1100, // Levels 1-10
    1320,
    1560,
    1820,
    2100,
    2400,
    2720,
    3060,
    3420,
    3800,
    4200, // Levels 11-20
    4620,
    5060,
    5520,
    6000,
    6500,
    7020,
    7560,
    8120,
    8700,
    9300, // Levels 21-30
    9920,
    10560,
    11220,
    11900,
    12600,
    13320,
    14060,
    14820,
    15600,
    16400, // Levels 31-40
  ];

  // Fire-pokemon images
  const CharmanderImg = "./images/charmander.png";
  const CharmeleonImg = "./images/charmeleon.png";
  const CharizardImg = "./images/charizard";

  // Pokemon evolution stages
  const pokemonStages = {
    charmander: {
      minLevel: 1,
      maxLevel: 15,
      image: CharmanderImg,
      name: "Charmander",
      colorClass: "bg-gradient-orange",
    },
    charmeleon: {
      minLevel: 16,
      maxLevel: 35,
      image: CharmeleonImg,
      name: "Charmeleon",
      colorClass: "bg-gradient-red",
    },
    charizard: {
      minLevel: 36,
      maxLevel: 40,
      image: CharizardImg,
      name: "Charizard",
      colorClass: "bg-gradient-orange-yellow",
    },
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("pokepet-data");
    if (savedData) {
      try {
        const { pet: savedPet, allTimeStats: savedAllTime } =
          JSON.parse(savedData);
        if (savedPet) setPet(savedPet);
        if (savedAllTime) setAllTimeStats(savedAllTime);
      } catch (error) {
        console.warn("Failed to load saved game data:", error);
      }
    }
  }, []);

  // Save data whenever pet or allTimeStats change
  useEffect(() => {
    const dataToSave = { pet, allTimeStats };
    localStorage.setItem("pokepet-data", JSON.stringify(dataToSave));
  }, [pet, allTimeStats]);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // HP degradation when happiness or energy is low
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((prevPet) => {
        if (prevPet.happiness < 50 || prevPet.energy < 50) {
          const newHealth = Math.max(0, prevPet.health - 3);
          if (newHealth < prevPet.health) {
            setShowFeedback(
              `⚠️ ${prevPet.name} is struggling! Low ${
                prevPet.happiness < 50 ? "happiness" : "energy"
              } is draining HP! 😰`
            );
          }
          return { ...prevPet, health: newHealth };
        }
        return prevPet;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Happiness decay mechanic - happiness gradually decreases over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((prevPet) => {
        const decayRate = prevPet.level <= 10 ? 1 : prevPet.level <= 25 ? 2 : 3; // Higher level = faster decay
        const newHappiness = Math.max(0, prevPet.happiness - decayRate);

        if (
          newHappiness < prevPet.happiness &&
          newHappiness % 20 === 0 &&
          newHappiness < 60
        ) {
          const messages = [
            `${prevPet.name} is feeling lonely... needs some coding attention!`,
            `${prevPet.name}'s flame is dimming... time for some commits!`,
            `${prevPet.name} misses the thrill of solving problems!`,
            `${prevPet.name} yearns for the excitement of new projects!`,
          ];
          setShowFeedback(
            messages[Math.floor(Math.random() * messages.length)]
          );
        }

        return { ...prevPet, happiness: newHappiness };
      });
    }, 30000); // Decay every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addCodingActivity = (type, amount) => {
    const newStats = { ...todayStats, [type]: todayStats[type] + amount };
    setTodayStats(newStats);

    // Update all-time stats for firestone requirements
    let newAllTimeStats = { ...allTimeStats };
    if (type === "newLanguages") {
      newAllTimeStats.totalLanguages = allTimeStats.totalLanguages + amount;
    }
    if (type === "projectsCompleted") {
      newAllTimeStats.totalProjects = allTimeStats.totalProjects + amount;
    }
    setAllTimeStats(newAllTimeStats);

    let expGain = 0;
    let healthChange = 0;
    let happinessChange = 0;
    let energyChange = 0;
    let message = "";

    switch (type) {
      case "commits":
        expGain = amount * 15;
        happinessChange = amount * 3;
        energyChange = -amount * 1;
        message = `+${amount} commits! ${pet.name}'s tail flame burns brighter! 🔥`;
        break;
      case "linesOfCode":
        expGain = Math.floor(amount / 10) * 8;
        energyChange = -Math.floor(amount / 50);
        message = `${amount} lines of code! ${pet.name} breathes fire into the code!`;
        break;
      case "hoursSpent":
        expGain = amount * 20;
        energyChange = -amount * 6;
        healthChange = amount > 8 ? -8 : 3;
        message =
          amount > 8
            ? `${pet.name} is overworked! Even fire types need rest! 😴`
            : `${amount}h of coding! ${pet.name} is on fire!`;
        break;
      case "newLanguages":
        expGain = amount * 60;
        happinessChange = amount * 12;
        message = `Learned ${amount} new language(s)! ${pet.name} roars with excitement!`;
        if (
          newAllTimeStats.totalLanguages >= 1 &&
          newAllTimeStats.totalProjects >= 5
        ) {
          message += " ✨ FIRE STONE ACHIEVED! ✨";
        }
        break;
      case "projectsCompleted":
        expGain = amount * 120;
        happinessChange = amount * 18;
        healthChange = amount * 8;
        message = `${amount} project(s) completed! ${pet.name} celebrates with a victory roar! 🏆🔥`;
        if (
          newAllTimeStats.totalLanguages >= 1 &&
          newAllTimeStats.totalProjects >= 5
        ) {
          message += " ✨ FIRE STONE ACHIEVED! ✨";
        }
        break;
      case "leetcodeSolved":
        expGain = amount * 25;
        happinessChange = amount * 5;
        energyChange = -amount * 2;
        message = `${amount} LeetCode problem(s) solved! ${pet.name}'s algorithmic skills are blazing! 🧠🔥`;
        break;
      default:
        break;
    }

    setPet((prevPet) => {
      const newExp = prevPet.experience + expGain;

      // Calculate new level based on experience
      let newLevel = 1;
      for (let i = experienceThresholds.length - 1; i >= 0; i--) {
        if (newExp >= experienceThresholds[i]) {
          newLevel = i + 1;
          break;
        }
      }

      let newStage = prevPet.stage;
      let newName = prevPet.name;

      // Check for evolution based on level
      if (newLevel >= 36 && prevPet.stage === "charmeleon") {
        // Check if Fire Stone requirements are met
        if (
          newAllTimeStats.totalLanguages >= 1 &&
          newAllTimeStats.totalProjects >= 5
        ) {
          newStage = "charizard";
          newName = "Charizard";
          setShowFeedback(
            `🎉 Charmeleon evolved into Charizard at level ${newLevel} using the Fire Stone! The ultimate coding dragon! 🔥`
          );
        } else {
          setShowFeedback(
            `${prevPet.name} reached level ${newLevel} but needs a Fire Stone to evolve! (1 language + 5 projects) 🔥`
          );
        }
      } else if (newLevel >= 16 && prevPet.stage === "charmander") {
        newStage = "charmeleon";
        newName = "Charmeleon";
        setShowFeedback(
          `🎉 Charmander evolved into Charmeleon at level ${newLevel}! Growing stronger! 🔥`
        );
      } else {
        setShowFeedback(message);
      }

      return {
        ...prevPet,
        name: newName,
        experience: newExp,
        level: newLevel,
        health: Math.max(0, Math.min(100, prevPet.health + healthChange)),
        happiness: Math.max(
          0,
          Math.min(100, prevPet.happiness + happinessChange)
        ),
        energy: Math.max(0, Math.min(100, prevPet.energy + energyChange)),
        stage: newStage,
      };
    });
  };

  const feedPet = () => {
    const newCoffeeCount = todayStats.coffeeCount + 1;
    setTodayStats((prev) => ({ ...prev, coffeeCount: newCoffeeCount }));

    if (newCoffeeCount > 5) {
      // Coffee overdose penalty
      setPet((prev) => ({
        ...prev,
        health: Math.max(0, Math.floor(prev.health * 0.7)), // 30% HP decrease
        happiness: Math.max(0, Math.floor(prev.happiness * 0.85)), // 15% happiness decrease
        energy: Math.min(100, prev.energy + 5), // Reduced energy boost
      }));
      setShowFeedback(
        `⚠️ ${pet.name} has had too much coffee today! Jittery and stressed! (${newCoffeeCount} coffees) 😵‍💫☕`
      );
    } else if (newCoffeeCount === 5) {
      setPet((prev) => ({
        ...prev,
        health: Math.min(100, prev.health + 8), // Reduced benefits
        happiness: Math.min(100, prev.happiness + 5),
        energy: Math.min(100, prev.energy + 15),
      }));
      setShowFeedback(
        `${pet.name} is getting caffeinated! Last safe coffee for today... ☕⚠️`
      );
    } else {
      setPet((prev) => ({
        ...prev,
        health: Math.min(100, prev.health + 12),
        happiness: Math.min(100, prev.happiness + 8),
        energy: Math.min(100, prev.energy + 18),
      }));
      setShowFeedback(
        `Made ${pet.name} a delicious Pokémon coffee! Caffeinated and ready to code! ☕🔥`
      );
    }
  };

  const restPet = () => {
    setPet((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 25),
      health: Math.min(100, prev.health + 8),
      happiness: Math.min(100, prev.happiness + 15),
    }));
    setShowFeedback(
      `You pet ${pet.name} gently! It growls with contentment! 🥰🔥`
    );
  };

  const powerNap = () => {
    setPet((prev) => ({
      ...prev,
      health: 100,
      happiness: 100,
      energy: 100,
    }));
    setTodayStats((prev) => ({ ...prev, coffeeCount: 0 })); // Reset coffee counter
    setShowFeedback(
      `${pet.name} took a power nap! Fully restored and coffee tolerance reset! 😴✨🔥`
    );
  };

  const getStatusColor = (value) => {
    if (value >= 70) return "text-green-500";
    if (value >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressWidth = (current, max) => {
    return Math.max(0, Math.min(100, (current / max) * 100));
  };

  const hasFireStone = () => {
    return allTimeStats.totalLanguages >= 1 && allTimeStats.totalProjects >= 5;
  };

  const canEvolveToCharizard = () => {
    return pet.level >= 36 && pet.stage === "charmeleon" && hasFireStone();
  };

  const currentStage = pokemonStages[pet.stage];
  const nextEvolutionExp =
    pet.level < 40 ? experienceThresholds[pet.level] : experienceThresholds[39];

  const getEvolutionHint = () => {
    if (pet.level >= 40) {
      return "✨ Max Level Charizard! ✨";
    } else if (pet.stage === "charizard") {
      return "🐉 Fully Evolved! Keep training to reach max level! 🐉";
    } else if (pet.stage === "charmeleon") {
      if (pet.level >= 36) {
        return hasFireStone()
          ? "Ready to evolve with Fire Stone!"
          : "Needs Fire Stone to evolve! (1 language + 5 projects)";
      }
      return "Evolves at Level 36 with Fire Stone";
    } else {
      return "Evolves at Level 16";
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #dc2626, #ea580c, #f97316)",
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🔥 PokéPet Fire Coder! 🔥
        </h1>
        <h3 className="text-xl font-bold text-white drop-shadow-md">
          Train your fire-type Pokémon through the power of coding!
        </h3>
      </div>

      {/* Critical Alert - Fixed position at top */}
      {showFeedback &&
        (showFeedback.includes("struggling") ||
          showFeedback.includes("draining HP")) && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-bold animate-pulse">
            ⚠️ CRITICAL ALERT ⚠️
            <br />
            {showFeedback}
          </div>
        )}

      {/* Regular Feedback - Global Overlay at Bottom */}
      {showFeedback &&
        !(
          showFeedback.includes("struggling") ||
          showFeedback.includes("draining HP")
        ) && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-100 border border-orange-500 text-orange-700 px-6 py-3 rounded-lg shadow-lg text-center font-semibold max-w-md animate-bounce">
            {showFeedback}
          </div>
        )}

      {/* Pokemon Display */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-gray-800">
        <div className="text-center mb-4">
          <img
            src={currentStage.image}
            alt={currentStage.name}
            className="w-32 h-32 mx-auto mb-4"
            style={{ imageRendering: "pixelated" }}
          />
          <h2 className="text-3xl font-bold mb-2">{pet.name}</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <StarIcon />
              <span className="font-semibold">Level {pet.level}</span>
            </div>
            <div className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
              {pet.type} Type
            </div>
          </div>
        </div>

        {/* Experience Progress */}
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Experience</span>
            <span className="text-sm">
              {pet.experience} / {nextEvolutionExp} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${getProgressWidth(pet.experience, nextEvolutionExp)}%`,
              }}
            ></div>
          </div>
          <p className="text-center mt-2 text-red-700 text-sm font-semibold">
            {getEvolutionHint()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HeartIcon />
            <span className="font-semibold">
              HP:{" "}
              <span className={getStatusColor(pet.health)}>
                {pet.health}/100
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pet.health}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-5 h-5 text-center">😊</span>
            <span className="font-semibold">
              Happiness:{" "}
              <span className={getStatusColor(pet.happiness)}>
                {pet.happiness}/100
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pet.happiness}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ZapIcon />
            <span className="font-semibold">
              Energy:{" "}
              <span className={getStatusColor(pet.energy)}>
                {pet.energy}/100
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pet.energy}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Fire Stone Achievement */}
      {hasFireStone() && (
        <div className="bg-gradient-to-r bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl mb-2"></div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              FIRE STONE ACHIEVED!
            </h3>
            <p className="text-red-700 font-medium">
              Your dedication to learning ({allTimeStats.totalLanguages}{" "}
              languages) and completing projects ({allTimeStats.totalProjects}{" "}
              projects) has earned you the legendary Fire Stone!
            </p>
            {canEvolveToCharizard() && (
              <p className="text-red-600 font-bold mt-2 animate-pulse">
                ✨ Charmeleon is ready to evolve into Charizard! ✨
              </p>
            )}
          </div>
        </div>
      )}

      {/* Fire Stone Progress */}
      {!hasFireStone() && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
          <div className="text-center">
            <img
              src="./images/firestone.png"
              alt="pokemon-firestone-image"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Fire Stone Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Paired Program Sessions
                  </span>
                  <span
                    className={`font-bold ${
                      allTimeStats.totalLanguages >= 1
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {allTimeStats.totalLanguages}/1
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      allTimeStats.totalLanguages >= 1
                        ? "bg-green-500"
                        : "bg-blue-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (allTimeStats.totalLanguages / 1) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Projects Completed
                  </span>
                  <span
                    className={`font-bold ${
                      allTimeStats.totalProjects >= 5
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {allTimeStats.totalProjects}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      allTimeStats.totalProjects >= 5
                        ? "bg-green-500"
                        : "bg-red-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (allTimeStats.totalProjects / 5) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Complete both requirements to earn the Fire Stone needed for
              Charmeleon → Charizard evolution!
            </p>
          </div>
        </div>
      )}

      {/* Pokemon Care */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* <h3 className="text-xl font-semibold mb-4 text-center">
          🔥 Pokémon Care 🔥
        </h3> */}

        {/* Coffee Counter */}
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            ☕ Daily Coffee Count: {todayStats.coffeeCount}/5
            {todayStats.coffeeCount > 5 && (
              <span className="text-red-600 font-bold"> - OVERDOSED!</span>
            )}
          </span>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={feedPet} className="btn btn-red">
            ☕️ Make a PokéCoffee
          </button>
          <button onClick={restPet} className="btn btn-orange">
            🥰 Pet Your Pokémon
          </button>
          <button onClick={powerNap} className="btn btn-purple">
            😴 Power Nap
          </button>
        </div>
      </div>

      {/* Coding Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
          <CodeIcon />
          Code Mastery
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">
                🔥 Commits: {todayStats.commits}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => addCodingActivity("commits", 1)}
                  className="btn btn-blue btn-sm"
                >
                  +1
                </button>
                <button
                  onClick={() => addCodingActivity("commits", 5)}
                  className="btn btn-blue-dark btn-sm"
                >
                  +5
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">
                💨 Lines of Code: {todayStats.linesOfCode}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => addCodingActivity("linesOfCode", 50)}
                  className="btn btn-green btn-sm"
                >
                  +50
                </button>
                <button
                  onClick={() => addCodingActivity("linesOfCode", 200)}
                  className="btn btn-green-dark btn-sm"
                >
                  +200
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">
                ⏰ Hours Trained: {todayStats.hoursSpent}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => addCodingActivity("hoursSpent", 1)}
                  className="btn btn-purple btn-sm"
                >
                  +1h
                </button>
                <button
                  onClick={() => addCodingActivity("hoursSpent", 4)}
                  className="btn btn-purple btn-sm"
                >
                  +4h
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">
                👥 Paired Program Sessions: {todayStats.newLanguages}
              </span>
              <button
                onClick={() => addCodingActivity("newLanguages", 1)}
                className="btn btn-yellow btn-sm"
              >
                +1
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium">
                🏆 Projects Completed: {todayStats.projectsCompleted}
              </span>
              <button
                onClick={() => addCodingActivity("projectsCompleted", 1)}
                className="btn btn-red btn-sm"
              >
                +1
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">
                🧠 LeetCode Solved: {todayStats.leetcodeSolved}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => addCodingActivity("leetcodeSolved", 1)}
                  className="btn btn-orange btn-sm"
                >
                  +1
                </button>
                <button
                  onClick={() => addCodingActivity("leetcodeSolved", 3)}
                  className="btn btn-orange btn-sm"
                >
                  +3
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="border border-red-200 rounded-lg p-4"
          style={{
            background: "linear-gradient(to right, #fef2f2, #fff7ed)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔥</div>
            <div>
              <h4 className="font-bold text-red-800 mb-2">
                Fire-Type Training Tips:
              </h4>
              <p className="text-red-700 text-sm">
                Your {pet.name} grows stronger with consistent coding practice!
                Commits boost happiness and fuel the tail flame. Learning new
                languages gives massive XP boosts. Complete projects for
                evolution energy, but don't overtrain - even fire types need
                rest to maintain their inner flame! 🔥✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokePet;
