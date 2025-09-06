// Monaco Editor TypeScript definitions for metadata rendering formulas
// This file is imported as raw text to provide IntelliSense in the editor

import type { GameState, CellData } from "./game";
import type { CustomMetadata, CustomMetadataField } from "./metadataSystem";

// Main metadata rendering context interface available to custom formulas
export declare interface MetadataRenderContext {
  // Canvas element for rendering (60x40 pixels, 3:2 aspect ratio to match tiles)
  canvas: HTMLCanvasElement;
  
  // Canvas 2D rendering context
  ctx: CanvasRenderingContext2D;
  
  // Metadata and field information
  metadata: CustomMetadata;
  field: CustomMetadataField;
  
  // Zone information
  zone: CellData;
  zonePosition: { row: number; col: number };
  
  // Actual zone dimensions (for reference)
  cellWidth: number;
  cellHeight: number;
  
  // Optional game state
  gameState?: GameState;
}

// Expected function signature for metadata rendering formulas
declare function renderMetadata(context: MetadataRenderContext): void;

// Canvas 2D API interfaces for better IntelliSense
declare interface CanvasRenderingContext2D {
  // Drawing methods
  fillText(text: string, x: number, y: number): void;
  strokeText(text: string, x: number, y: number): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  strokeRect(x: number, y: number, width: number, height: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
  
  // Path methods
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  fill(): void;
  stroke(): void;
  
  // State methods
  save(): void;
  restore(): void;
  
  // Style properties
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  lineWidth: number;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

// Text alignment options
type CanvasTextAlign = "start" | "end" | "left" | "right" | "center";
type CanvasTextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

// Common zone types (for IntelliSense suggestions)
type ZoneType = 
  | "residential"
  | "commercial" 
  | "industrial"
  | "road"
  | "park"
  | "water";