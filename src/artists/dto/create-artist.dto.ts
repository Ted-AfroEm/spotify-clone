export class CreateArtistDto {
  /**
   * The ID of the existing User that this Artist profile belongs to.
   * This corresponds to the @OneToOne relationship with User.
   */
  userId: number;
}
