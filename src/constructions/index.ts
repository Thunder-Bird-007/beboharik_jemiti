// Central import point: every construction module registers itself (via
// registerConstruction) as a side effect of being imported here. Add a new
// construction by creating its file under src/constructions/ and importing
// it below — see README.md for the full walkthrough.
import tri1 from "./tri1";
import tri2 from "./tri2";
import tri3 from "./tri3";
import tri4 from "./tri4";
import tri5 from "./tri5";
import tri6 from "./tri6";
import tri7 from "./tri7";
import quad8 from "./quad8";
import quad9 from "./quad9";
import quad10 from "./quad10";
import quad11 from "./quad11";
import quad12 from "./quad12";
import quad13 from "./quad13";

export const T01_CONSTRUCTIONS = [tri1, tri2, tri3, tri4, tri5, tri6, tri7];
export const T02_CONSTRUCTIONS = [quad8, quad9, quad10, quad11, quad12, quad13];
export const ALL_CONSTRUCTIONS = [...T01_CONSTRUCTIONS, ...T02_CONSTRUCTIONS];
