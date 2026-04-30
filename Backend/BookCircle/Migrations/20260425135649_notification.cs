using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookCircle.Migrations
{
    /// <inheritdoc />
    public partial class notification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Users_ReceiverId",
                table: "Notification");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Users_ReceiverId",
                table: "Notification",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Users_ReceiverId",
                table: "Notification");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Users_ReceiverId",
                table: "Notification",
                column: "ReceiverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
