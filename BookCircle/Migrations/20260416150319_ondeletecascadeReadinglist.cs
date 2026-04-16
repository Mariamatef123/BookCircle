using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookCircle.Migrations
{
    /// <inheritdoc />
    public partial class ondeletecascadeReadinglist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReadingListBooks_ReadingLists_ReadingListId",
                table: "ReadingListBooks");

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingListBooks_ReadingLists_ReadingListId",
                table: "ReadingListBooks",
                column: "ReadingListId",
                principalTable: "ReadingLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
