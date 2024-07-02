import DinoGame from './game/DinoGame.js'

// Create a new Dino game instance with specified width and height
const game = new DinoGame(600, 150)

// Check if the device is a touch device
const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

if (isTouchDevice) {
  // Add event listeners for touch devices
  document.addEventListener('touchstart', ({ touches }) => {
    if (touches.length === 1) {
      game.onInput('jump')
    } else if (touches.length === 2) {
      game.onInput('duck')
    }
  })

  document.addEventListener('touchend', ({ touches }) => {
    game.onInput('stop-duck')
  })
} else {
  // Key codes for jump and duck actions
  const keycodes = {
    // up arrow, spacebar
    JUMP: { 38: 1, 32: 1 },
    // down arrow
    DUCK: { 40: 1 },
  }

  // Add event listeners for non-touch devices (keyboard)
  document.addEventListener('keydown', ({ keyCode }) => {
    if (keycodes.JUMP[keyCode]) {
      game.onInput('jump')
    } else if (keycodes.DUCK[keyCode]) {
      game.onInput('duck')
    }
  })

  document.addEventListener('keyup', ({ keyCode }) => {
    if (keycodes.DUCK[keyCode]) {
      game.onInput('stop-duck')
    }
  })
}

// Start the game and log any errors
game.start().catch(console.error)
