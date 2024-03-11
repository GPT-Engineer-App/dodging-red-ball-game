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
    setScore((prevScore) => prevScore + 1);
    setBoard((prevBoard) => {
      return prevBoard.map((row) => {
        const newRow = row.slice(1);
        newRow.push(Math.floor(Math.random() * 2));
        return newRow;
      });
    });
    if (board[ballPosition][1] === 1) {
      setGameOver(true);
    }
  };

  const moveBall = (direction) => {
    setBallPosition((prevPosition) => {
      const newPosition = { ...prevPosition };
      switch (direction) {
        case "up":
          if (newPosition.row > 0) newPosition.row -= 1;
          break;
        case "down":
          if (newPosition.row < boardSize - 1) newPosition.row += 1;
          break;
        case "left":
          if (newPosition.column > 0) newPosition.column -= 1;
          break;
        case "right":
          if (newPosition.column < board[0].length - 1) newPosition.column += 1;
          break;
        default:
          break;
      }
      return newPosition;
    });
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        moveBall("up");
        break;
      case "ArrowDown":
        moveBall("down");
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
      {gameOver && board[ballPosition][0] === 1 && (
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
