using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookCircle.Migrations
{
    /// <inheritdoc />
    public partial class BorrowCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BorrowRequests_AvailabilityDates_AvailabilityDateId",
                table: "BorrowRequests");

            migrationBuilder.AddForeignKey(
                name: "FK_BorrowRequests_AvailabilityDates_AvailabilityDateId",
                table: "BorrowRequests",
                column: "AvailabilityDateId",
                principalTable: "AvailabilityDates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BorrowRequests_AvailabilityDates_AvailabilityDateId",
                table: "BorrowRequests");

            migrationBuilder.AddForeignKey(
                name: "FK_BorrowRequests_AvailabilityDates_AvailabilityDateId",
                table: "BorrowRequests",
                column: "AvailabilityDateId",
                principalTable: "AvailabilityDates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
