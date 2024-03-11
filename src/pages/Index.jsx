import React, { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Button } from "@chakra-ui/react";

const boardSize = 20;
const initialBoard = [...Array(boardSize)].map(() => Array(6).fill(0));

const Index = () => {
  const [board, setBoard] = useState(initialBoard);
  const [ballPosition, setBallPosition] = useState(Math.floor(boardSize / 2));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        updateBoard();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  const updateBoard = () => {
    setScore(score + 1);
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row, index) => {
        if (index === ballPosition) {
          const isTurningGreen = Math.round(Math.random()) === 1;
          if (isTurningGreen) setGameOver(true);
          return [isTurningGreen ? 1 : 0, ...row.slice(0, -1)];
        }
        return [Math.round(Math.random()), ...row.slice(0, -1)];
      });
    });
  };

  const moveBall = (direction) => {
    setBallPosition((prevPosition) => {
      if (direction === "up" && prevPosition > 0) {
        return prevPosition - 1;
      } else if (direction === "down" && prevPosition < boardSize - 1) {
        return prevPosition + 1;
      }
      return prevPosition;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      moveBall("up");
    } else if (e.key === "ArrowDown") {
      moveBall("down");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <VStack p={4} spacing={4}>
      <Text fontSize="2xl">Score: {score}</Text>
      <Flex justify="center">
        {board.map((row, rowIndex) => (
          <Flex key={rowIndex} direction="column">
            {row.map((cell, cellIndex) => (
              <Box key={cellIndex} w="50px" h="50px" bg={cell === 1 ? "green.500" : ballPosition === rowIndex && cellIndex === board[0].length - 1 ? "red.500" : "white"} border="1px" borderColor="black" />
            ))}
          </Flex>
        ))}
      </Flex>
      {gameOver && (
        <>
          <Text fontSize="3xl" color="red.500">
            Game Over!
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => {
              setBoard(initialBoard);
              setBallPosition(Math.floor(boardSize / 2));
              setGameOver(false);
              setScore(0);
            }}
          >
            Restart Game
          </Button>
        </>
      )}
    </VStack>
  );
};

export default Index;
