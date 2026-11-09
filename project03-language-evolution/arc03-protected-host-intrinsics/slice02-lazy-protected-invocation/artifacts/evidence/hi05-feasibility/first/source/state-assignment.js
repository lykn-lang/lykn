let current = "first";
function advance() {
  kernel.EQ(current, "second");
}
export {current, advance};
