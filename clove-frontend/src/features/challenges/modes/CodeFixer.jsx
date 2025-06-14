import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "features/challenges/styles/CodeFixer.module.scss";

const CosmicJava = ({
  onComplete,
  challengeType,
  isLastChallenge,
  topicId,
}) => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(480);
  const [score, setScore] = useState(0);
  const [bugsFixed, setBugsFixed] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [showHint, setShowHint] = useState(false);
  const [userFixes, setUserFixes] = useState({
    fix1: "String",
    fix2: "||",
    fix3: "power.length()",
    fix4: "Double",
    fix5: "thrusterPower[i].toUpperCase()",
  });
  const [verifiedFixes, setVerifiedFixes] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const correctAnswers = {
    fix1: "int",
    fix2: "&&",
    fix3: "power",
    fix4: "int",
    fix5: "thrusterPower[i]",
  };

  const expectedOutput = "All thrusters fired successfully at 85% power";

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          if (!isCompleted) {
            handleCompletion(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const systemIntegrity = Math.floor((timeLeft / 480) * 100);

  const handleHintClick = () => {
    if (hintsLeft > 0) {
      setShowHint(true);
      setHintsLeft(hintsLeft - 1);
      updateScore(-15);
    } else {
      alert("Engineering manual unavailable!");
    }
  };

  const updateScore = (points) => {
    setScore((prev) => Math.max(0, prev + points));
  };

  const handleFixChange = (fixId, value) => {
    setUserFixes((prev) => ({
      ...prev,
      [fixId]: value,
    }));
  };

  const validateFix = (fixId) => {
    return userFixes[fixId] === correctAnswers[fixId];
  };

  const handleCompletion = (success) => {
    if (isCompleted) return;

    setIsCompleted(true);
    if (onComplete) {
      onComplete({
        success,
        score,
        type: challengeType,
        timestamp: new Date().toISOString(),
      });
    }

    if (success && isLastChallenge) {
      setTimeout(() => navigate(`/my-deck/${topicId}`), 1000);
    }
  };

  const checkSolution = () => {
    let newVerified = new Set(verifiedFixes);
    let newBugsFixed = 0;

    Object.keys(correctAnswers).forEach((fixId) => {
      if (validateFix(fixId) && !verifiedFixes.has(fixId)) {
        newVerified.add(fixId);
        newBugsFixed++;
      }
    });

    setVerifiedFixes(newVerified);
    setBugsFixed(newVerified.size);
    updateScore(newBugsFixed * 20);

    if (newVerified.size === 5) {
      setTimeout(() => {
        alert(
          "SYSTEM RESTORED! Thrusters operational!\n+50pt bonus for perfect repair!"
        );
        updateScore(50);
        handleCompletion(true);
      }, 500);
    } else if (newBugsFixed > 0) {
      alert(`Partial repair complete! ${newBugsFixed} bugs fixed!`);
    } else {
      alert("Warning: System still unstable! Keep debugging!");
    }
  };

  const handleBugClick = (bugNum) => {
    const input = document.getElementById(`fix${bugNum}`);
    if (input) input.focus();
  };

  const getInputClass = (fixId) => {
    if (verifiedFixes.has(fixId)) return styles.verified;
    return validateFix(fixId) ? styles.correct : styles.wrong;
  };

  return (
    <div className={styles.missionContainer}>
      <div className={styles.gamePanel}>
        <div className={styles.missionInfo}>
          <h2 className={styles.missionTitle}>MISSION: BETA-9</h2>
          <p className={styles.missionDescription}>
            Debug the spacecraft's thruster control system before it's too late!
            Find and fix all syntax errors to prevent catastrophic failure.
          </p>
        </div>

        <div className={styles.timerContainer}>
          <div>EMERGENCY TIMER</div>
          <div className={styles.timer}>{formatTime(timeLeft)}</div>
        </div>

        <div className={styles.hintSystem}>
          <div className={styles.hintTitle}>ENGINEERING MANUAL</div>
          <button
            className={styles.hintBtn}
            onClick={handleHintClick}
            disabled={hintsLeft === 0}
          >
            REQUEST HELP ({hintsLeft} LEFT) -15pts
          </button>
          {showHint && (
            <div className={styles.hintContent}>
              <p>Common Issues:</p>
              <ul>
                <li>Check variable types</li>
                <li>Verify logical operators</li>
                <li>Array index boundaries</li>
                <li>Method return types</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.scoring}>
          <div className={styles.scoreDisplay}>
            CREDITS: <span>{score}</span>
          </div>
          <div>
            BUGS FIXED: <span>{bugsFixed}</span>/5
          </div>
          <div>
            SYSTEM INTEGRITY: <span>{systemIntegrity}%</span>
          </div>
        </div>
      </div>

      <div className={styles.challengeArea}>
        <h2 className={styles.challengeTitle}>CODE FIXER CHALLENGE</h2>

        <div className={styles.bugRadar}>
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`${styles.bugIndicator} ${
                verifiedFixes.has(`fix${num}`) ? styles.fixed : ""
              }`}
              onClick={() => handleBugClick(num)}
            >
              {num}
            </div>
          ))}
        </div>

        <div className={styles.codeEditor}>
          <pre>
            <code>
              {`public class ThrusterController { private int[] thrusterPower = {0, 0, 0, 0}; public void setPower(int thruster, `}
              <input
                id="fix1"
                className={`${styles.codeInput} ${getInputClass("fix1")}`}
                value={userFixes.fix1}
                onChange={(e) => handleFixChange("fix1", e.target.value)}
              />
              {` power) {
    if (thruster >= 0 `}
              <input
                id="fix2"
                className={`${styles.codeInput} ${getInputClass("fix2")}`}
                value={userFixes.fix2}
                onChange={(e) => handleFixChange("fix2", e.target.value)}
              />
              {` thruster < thrusterPower.length) {
      thrusterPower[thruster] = `}
              <input
                id="fix3"
                className={`${styles.codeInput} ${getInputClass("fix3")}`}
                value={userFixes.fix3}
                onChange={(e) => handleFixChange("fix3", e.target.value)}
              />
              {`;
    }
  }

  public void fireThrusters(`}
              <input
                id="fix4"
                className={`${styles.codeInput} ${getInputClass("fix4")}`}
                value={userFixes.fix4}
                onChange={(e) => handleFixChange("fix4", e.target.value)}
              />
              {` duration) {
    for (int i = 0; i < thrusterPower.length; i++) {
      System.out.println("Thruster " + i + " firing at " + `}
              <input
                id="fix5"
                className={`${styles.codeInput} ${getInputClass("fix5")}`}
                value={userFixes.fix5}
                onChange={(e) => handleFixChange("fix5", e.target.value)}
              />
              {` + "% power");
    }
  }
}`}
            </code>
          </pre>
        </div>

        <div className={styles.expectedOutput}>
          <h3>EXPECTED OUTPUT</h3>
          <div className={styles.outputWindow}>{expectedOutput}</div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={checkSolution}
          disabled={timeLeft <= 0 || isCompleted}
        >
          {timeLeft > 0 ? "VALIDATE REPAIRS" : "SYSTEM FAILURE"}
        </button>
      </div>
    </div>
  );
};

export default CosmicJava;
