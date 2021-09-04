import Phaser from 'phaser'

export default class MovingPlatformSpawner
{
	private scene! : Phaser.Scene;
	private groundKey! : string;
	private groundLeftKey! : string;
	private groundRightKey! : string;
	private _group: Phaser.Physics.Arcade.StaticGroup;
	
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, groundKey = 'ground', groundLeftKey = 'groundLeft', groundRightKey = 'groundRight')
	{
		this.scene = scene
		this.groundKey = groundKey
        this.groundLeftKey = groundLeftKey
        this.groundRightKey = groundRightKey

		this._group = this.scene.physics.add.staticGroup()
	}

	get group()
	{
		return this._group
	}

	spawn()
	{
        this.group.create(600,340, this.groundLeftKey).setScale(0.5).refreshBody();
        this.group.create(660,340, this.groundRightKey).setScale(0.5).refreshBody();
        this.group.create(300,400, this.groundLeftKey).setScale(0.5).refreshBody();
        this.group.create(360,400, this.groundRightKey).setScale(0.5).refreshBody();

        this.group.children.entries[0].disableBody(true, true); // hide while not completedLevels = 4
        this.group.children.entries[1].disableBody(true, true);
		
		return this.group
	}
}