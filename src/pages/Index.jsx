import React, { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Button } from "@chakra-ui/react";

const boardSize = 20;
const initialBoard = [...Array(boardSize)].map(() => Array(6).fill(0));

const Index = () => {
  const [board, setBoard] = useState(initialBoard);
  const [ballYPosition, setBallYPosition] = useState(board[0].length - 1);
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
    setScore((prevScore) => prevScore + 1);
    setBoard((prevBoard) => {
      return prevBoard.map((row) => {
        const newObstacle = Math.floor(Math.random() * 3);
        const newRow = [newObstacle, ...row.slice(0, row.length - 1)];
        return newRow;
      });
    });
    if (board[ballPosition][ballYPosition] === 1) {
      setGameOver(true);
    } else {
      if (board[ballPosition][0] === 1) {
        setGameOver(true);
      }
    }
  };

  const moveBall = (direction) => {
    if (direction === "left" || direction === "right") {
      setBallPosition((prevPosition) => {
        let newPosition = prevPosition;
        if (direction === "left") newPosition = Math.max(0, prevPosition - 1);
        if (direction === "right") newPosition = Math.min(boardSize - 1, prevPosition + 1);
        return newPosition;
      });
    } else {
      setBallYPosition((prevYPosition) => {
        let newYPosition = prevYPosition;
        if (direction === "up") newYPosition = Math.max(0, prevYPosition - 1);
        if (direction === "down") newYPosition = Math.min(board[0].length - 1, prevYPosition + 1);
        return newYPosition;
      });
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        setBallYPosition((prev) => Math.max(0, prev - 1));
        break;
      case "ArrowDown":
        setBallYPosition((prev) => Math.min(board[0].length - 1, prev + 1));
        break;
      case "ArrowLeft":
        moveBall("left");
        break;
      case "ArrowRight":
        moveBall("right");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ballYPosition]);

  return (
    <VStack p={4} spacing={4}>
      <Text fontSize="2xl">Score: {score}</Text>
      <Text fontSize="xl">
        Ball Position: ({ballPosition}, {ballYPosition})
      </Text>
      <Flex justify="center">
        {board.map((row, rowIndex) => (
          <Flex key={rowIndex} direction="column">
            {row.map((cell, cellIndex) => (
              <Box key={cellIndex} w="50px" h="50px" bg={cell === 1 ? "green.500" : ballPosition === rowIndex && cellIndex === ballYPosition ? "red.500" : "white"} border="1px" borderColor="black" />
            ))}
          </Flex>
        ))}
      </Flex>
      {gameOver && board[ballPosition][0] === 1 && (
        <>
          <Text fontSize="3xl" color="red.500">
            Game over
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
