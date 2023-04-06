# Trusses in Nature2D
Exploring trusses to make bridges and towers in Nature2D

* [Overview](#overview)
* [Bridges](#bridges)
* [Hydraulics](#hydraulics)
* [Towers](#towers)

<h2 id="overview">Overview</h2>

The last week I spent some time trying to create rigid structures like bridges, towers and cranes with constraints in [Nature2D](https://github.com/jaipack17/Nature2D), my physics library. I also further went on implementing hydraulics.

The idea was to create nodes, each connected by different beams that connect different nodes together to form a rigid framework. Initially I tried making a Polybridge clone, but gradually shifted away from bridges to a variety of structures.

I started off with a few red coloured nodes on the canvas that would act as "anchors", they do not move at all and allow being connected to other nodes. These nodes are points created with `Engine:Create()`. Soon I got the sandbox ready, clicking these anchored nodes would allow me to create new nodes 100 pixels away from the anchored node, which would then be interconnected with a rod constraint. Nodes created in this way can also be clicked to create new nodes in different directions. Two existing nodes can also be connected together this way. The angle at which the new node is created is limited to multiples of 15. Here are the important snippets of the code besides user input.

```lua
local Nodes = {}

function Node(p)
    local n = Engine:Create("Point", {
		Position = p,
		Snap = true,
		Radius = 10,
		Color = Color3.new(1, 1, 1),
		Visible = true
	})

	table.insert(Nodes, n)
	return n
end

-- Creating the rod constraint once we have both the node that we clicked 
-- and the new node that was created
local rod = Engine:Create("Constraint", {
    Type = "Rod",
    Point1 = previousNode, -- the node that was clicked
    Point2 = currentNode, -- new node
    Color = color,
    Thickness = 8,
    Visible = true
})

-- Limiting the angle at which new node is created to multiples of 15
local mouse = game:GetService("UserInputService"):GetMouseLocation()
-- currentNode is the node that was clicked
local currentRotation = math.deg(math.atan2(mouse.Y - currentNode.pos.Y, mouse.X - currentNode.pos.X))  
local targetRotation

if currentRotation > 0 then
    targetRotation = math.ceil(currentRotation/15.0) * 15
elseif math.abs(currentRotation) < 7.5 and math.abs(currentRotation) >= 0 then
    targetRotation = 0
elseif currentRotation < 0 then
    targetRotation = math.floor(currentRotation/15.0) * 15
end

targetRotation = math.rad(targetRotation)

local r = 100
local location = Vector2.new(
    currentNode.pos.X + (math.cos(targetRotation) * r), 
    currentNode.pos.Y + (math.sin(targetRotation) * r)
)

-- Creating a new node
Node(location)
```

Initially the nodes are anchored, which means that the rod constraints do not move. However, when these nodes are unanchored, the rod contraints hold these nodes together in place giving a rigid structure. Note that anchors (red nodes) are never unanchored. In action:

<video controls="" autoplay="" name="media" width="60%">
    <source src="https://i.imgur.com/TjDLOWn.mp4" type="video/mp4">
</video>

<h2 id="bridges">Bridges</h2>

Coming onto bridges, I started with two tools - rods and roads. My idea was to make these roads collidable and have rods act just like roads but not collide with any other object, just like polybridge! However this failed due to the peculiar object inheritance system in Nature2D which surely needs a big rework, so ultimately rods and roads are just there for aesthetic reasons :P. Brown constraints are roads and yellow ones are rods that hold everything together.

Here are some interesting bridges:

<video controls="" autoplay="" name="media" width="60%">
    <source src="https://i.imgur.com/f8gzc2n.mp4" type="video/mp4">
</video>

Tower Bridge in London

<video controls="" autoplay="" name="media" width="60%">
    <source src="https://i.imgur.com/vfMPNEl.mp4" type="video/mp4">
</video>

Golden Gate Bridge

<video controls="" autoplay="" name="media" width="60%">
    <source src="https://i.imgur.com/2R4EpuP.mp4" type="video/mp4">
</video>

<h2 id="hydraulics">Hydraulics</h2>

I went on adding basic hydraulics mechanism to the sandbox! Represented by blue rod constraints, they have the ability to become longer or shorter with time. I accomplished this by changing the `restLength` property of Nature2D constraints each frame by a certain amount until the target amount was achieved.

```lua
local step = 0.5 -- can be changed to -ve as well
local max = 150

-- initialL represents the initial lengths of all hydraulic constraints
for i, h in ipairs(Hydraulics) do
    h:SetLength(math.clamp(h.restLength + step, 0, initialL[i] + max))
end
```

Here's a bridge that's meant for ships to pass through underneath. The bridge separates when the hydraulics start working.

<video controls="" autoplay="" name="media" width="60%">
    <source src="https://i.imgur.com/zaaJDmB.mp4" type="video/mp4">
</video>

<h2 id="towers">Towers</h2>

I also tried to build some other kinds of rigid structures, like towers! Here's the Eiffel Tower made with Nature2D constraints! The constraints hold up quite well together.

<video controls="" autoplay="tue" name="media" width="60%" loop="true">
    <source src="https://i.imgur.com/aQ5cTsC.mp4" type="video/mp4">
</video>

It was quite fun to work on this and has given me a lot of new ideas on how I can improve Nature2D. [This](https://www.youtube.com/watch?v=oulfRfqTxJA&ab_channel=AngeTheGreat) video by AngeTheGreat has also inspired me to create visualisations of tension and compression on each constraint of the truss. But that's for later. Until next time!

<br/><br/><br/>