export default function getInfluenceWhatsappUrl(
    shareUrl: string,
    competitionName: string
) {
    const text = `Participe da Copa Hemocione "${competitionName}" de doação de sangue e me ajude a salvar mais vidas!`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);
    return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
}
