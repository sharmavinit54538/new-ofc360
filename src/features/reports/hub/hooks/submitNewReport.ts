export async function submitNewReport(data: any, mutate: any, onSuccess: () => void) {
  if (!data.name.trim()) return;
  try {
    await mutate(data).unwrap();
    onSuccess();
  } catch (err) {
    console.error(err);
  }
}
